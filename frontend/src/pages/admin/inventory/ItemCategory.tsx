import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableCell, TableRow, TableHead, TableBody, TableContainer, Paper,
  IconButton, InputAdornment, Snackbar, Alert, Fade, FormControl, Select, MenuItem, Skeleton,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import { useDebounce } from 'use-debounce';
import { createSelector } from 'reselect';
import {
  getAllCategoryCards,
  createCategoryCard,
  updateCategoryCard,
  deleteCategoryCard,
  searchCategoryCards,
  clearCategoryCardError,
} from '../../../redux/categoryRelated/categoryCard';

interface CategoryCard {
  _id: string;
  categoryCard: string;
  description: string;
}

interface RootState {
  categoryCard: {
    categoryCardsList: CategoryCard[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

// Redux Selectors
const selectCategoryCardState = (state: RootState) => state.categoryCard;
const selectUserState = (state: RootState) => state.user;

const selectCategoryCards = createSelector([selectCategoryCardState], (categoryCard) => categoryCard?.categoryCardsList || []);
const selectLoading = createSelector([selectCategoryCardState], (categoryCard) => categoryCard?.loading || false);
const selectError = createSelector([selectCategoryCardState], (categoryCard) => categoryCard?.error || null);
const selectAdminID = createSelector([selectUserState], (user) => user?.currentUser?._id);

const ItemCategoryCard: React.FC = () => {
  const dispatch = useDispatch();
  const categoryCards = useSelector(selectCategoryCards);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const adminID = useSelector(selectAdminID);
  const userState = useSelector(selectUserState);

  const initialFormData = {
    categoryCard: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [debouncedFormData] = useDebounce(formData, 300);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [actionLoading, setActionLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    console.log('User state:', userState);
    console.log('adminID:', adminID);
    if (adminID) {
      console.log('ItemCategoryCard useEffect: Preparing to fetch data');
      const timer = setTimeout(() => {
        console.log('ItemCategoryCard useEffect: Fetching category cards');
        dispatch(getAllCategoryCards(adminID)).catch((err) => {
          console.error('Fetch error:', err, err.response?.data);
          setSnack({ open: true, message: `Failed to fetch category cards: ${err.message}`, severity: 'error' });
        });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSnack({ open: true, message: 'Please log in to view category cards', severity: 'error' });
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (error) {
      console.log('Error from Redux:', error);
      setSnack({
        open: true,
        message: error.includes('404')
          ? 'No category cards found for this user. Please check the admin ID or server configuration.'
          : error,
        severity: 'error',
      });
      dispatch(clearCategoryCardError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    console.log('Search query changed:', debouncedSearchQuery);
    if (adminID) {
      if (debouncedSearchQuery) {
        dispatch(searchCategoryCards({ adminID, searchQuery: debouncedSearchQuery }));
      } else {
        dispatch(getAllCategoryCards(adminID));
      }
    }
  }, [debouncedSearchQuery, adminID, dispatch]);

  const validateForm = (): string | null => {
    if (!debouncedFormData.categoryCard.trim()) return 'Category card name is required';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fields = ['categoryCard', 'description'];
      if (index < fields.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) nextInput.focus();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called with payload:', debouncedFormData);
    const validationError = validateForm();
    if (validationError) {
      setSnack({ open: true, message: validationError, severity: 'warning' });
      return;
    }

    setActionLoading(true);
    const payload = {
      categoryCard: debouncedFormData.categoryCard.trim(),
      description: debouncedFormData.description.trim() || '',
      adminID: adminID || '',
    };

    try {
      if (editId) {
        console.log('Updating category card:', editId, payload);
        dispatch({
          type: 'categoryCard/updateCategoryCardLocally',
          payload: { id: editId, categoryCardData: { _id: editId, ...payload } },
        });
        await dispatch(updateCategoryCard({ id: editId, categoryCardData: payload })).unwrap();
        setSnack({ open: true, message: 'Category card updated successfully', severity: 'success' });
      } else {
        console.log('Creating category card:', payload);
        dispatch({
          type: 'categoryCard/createCategoryCardLocally',
          payload: { _id: `temp-${Date.now()}`, ...payload },
        });
        await dispatch(createCategoryCard(payload)).unwrap();
        setSnack({ open: true, message: 'Category card created successfully', severity: 'success' });
      }
      setFormData(initialFormData);
      setEditId(null);
      setOpenDialog(false);
    } catch (error: any) {
      console.error('Submit error:', error, error.response?.data);
      setSnack({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save category card',
        severity: 'error',
      });
      dispatch(getAllCategoryCards(adminID));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (categoryCard: CategoryCard) => {
    console.log('handleEdit called:', categoryCard._id);
    setFormData({
      categoryCard: categoryCard.categoryCard,
      description: categoryCard.description || '',
    });
    setEditId(categoryCard._id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    console.log('handleDelete called:', id);
    setActionLoading(true);
    try {
      dispatch({
        type: 'categoryCard/deleteCategoryCardLocally',
        payload: id,
      });
      await dispatch(deleteCategoryCard({ id, adminID })).unwrap();
      setSnack({ open: true, message: 'Category card deleted successfully', severity: 'success' });
    } catch (error: any) {
      console.error('Delete error:', error, error.response?.data);
      setSnack({ open: true, message: 'Failed to delete category card', severity: 'error' });
      dispatch(getAllCategoryCards(adminID));
    } finally {
      setActionLoading(false);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const pageCount = Math.ceil(categoryCards.length / itemsPerPage);
  const currentPageData = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return categoryCards.slice(offset, offset + itemsPerPage);
  }, [categoryCards, currentPage, itemsPerPage]);

  const CategoryCardRow = memo(({ entry, onEdit, onDelete }: { entry: CategoryCard, onEdit: (categoryCard: CategoryCard) => void, onDelete: (id: string) => void }) => {
    console.log(`CategoryCardRow rendering: ${entry._id}`);
    return (
      <TableRow sx={{ '&:hover': { bgcolor: '#f1f1f1' }, transition: 'background-color 0.2s' }}>
        <TableCell sx={{ textAlign: 'center' }}>{entry.categoryCard}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{entry.description}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <IconButton onClick={() => onEdit(entry)} aria-label="Edit Category Card" disabled={actionLoading}>
            <EditIcon style={{ color: '#555', fontSize: '16px' }} />
          </IconButton>
          <IconButton onClick={() => onDelete(entry._id)} aria-label="Delete Category Card" disabled={actionLoading}>
            <DeleteIcon style={{ color: '#555', fontSize: '16px' }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  const renderFormFields = () => {
    const fields = [
      { name: 'categoryCard', label: 'Category Card Name *', type: 'text' },
      { name: 'description', label: 'Description', type: 'text', multiline: true, rows: 2 },
    ];

    return fields.map((field, index) => (
      <Box key={field.name} sx={{ mb: 2 }}>
        <Typography component="label" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: '#333' }}>
          {field.label}
        </Typography>
        <TextField
          type={field.type}
          name={field.name}
          value={formData[field.name as keyof typeof formData]}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, index)}
          placeholder={field.label.replace(' *', '')}
          required={field.label.includes('*')}
          inputRef={(el: HTMLInputElement) => (inputRefs.current[index] = el)}
          fullWidth
          multiline={field.multiline}
          rows={field.rows}
          disabled={actionLoading}
          sx={{ '& .MuiInputBase-input': { p: '10px', fontSize: '14px' } }}
        />
      </Box>
    ));
  };

  if (!adminID) {
    return <Typography>Please log in to view category cards.</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        p: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        bgcolor: '#f9f9f9',
      }}
    >
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <Typography
        variant="h1"
        sx={{ textAlign: 'center', color: '#1a2526', fontSize: 24, mb: 2 }}
      >
        Category Card Management
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '240px' }}
          disabled={actionLoading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          disabled={actionLoading}
        >
          Add New Category Card
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Category Card' : 'Add Category Card'}</DialogTitle>
        <DialogContent>
          <form id="category-card-form" onSubmit={handleSubmit}>
            {renderFormFields()}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error" disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-card-form"
            variant="contained"
            sx={{
              bgcolor: editId ? '#ffc107' : '#28a745',
              color: editId ? '#212529' : 'white',
              '&:hover': { bgcolor: editId ? '#ffb300' : '#1e7e34' },
            }}
            disabled={actionLoading}
            aria-label={editId ? 'Update Category Card' : 'Add Category Card'}
          >
            {actionLoading ? 'Saving...' : editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Fade in={!loading} timeout={300}>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: '#fff',
            borderRadius: 1,
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
            p: 1,
            mt: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a2526' }}>
                {['Category Card', 'Description', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 3 }).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : currentPageData.length > 0 ? (
                currentPageData.map((entry) => (
                  <CategoryCardRow key={entry._id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#999' }}>
                    No category cards found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          gap: 1,
        }}
      >
        <Typography sx={{ color: '#1a2526', textAlign: 'center' }}>
          Showing {currentPageData.length} of {categoryCards.length} records
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
          <FormControl variant="outlined" size="small">
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              aria-label="Items per page"
              disabled={actionLoading}
            >
              {[5, 10, 20, 30].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            listStyle: 'none',
            p: 0,
            my: 2,
            flexWrap: 'wrap',
            '& .page': { mx: 0.5 },
            '& .page-link': {
              p: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: 1,
              cursor: 'pointer',
              bgcolor: '#f9f9f9',
              color: '#1a2526',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              fontSize: '14px',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { bgcolor: '#e0e0e0' },
            },
            '& .active .page-link': {
              bgcolor: '#4caf50',
              color: 'white',
              borderColor: '#4caf50',
              fontWeight: 'bold',
            },
            '& .disabled .page-link': {
              cursor: 'not-allowed',
              opacity: 0.5,
            },
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              '& .page-link': { p: '5px 8px', fontSize: '12px' },
            },
          }}
        >
          <ReactPaginate
            previousLabel={'←'}
            nextLabel={'→'}
            pageCount={pageCount}
            onPageChange={({ selected }) => {
              setCurrentPage(selected);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page'}
            pageLinkClassName={'page-link'}
            previousClassName={'page'}
            nextClassName={'page'}
            breakLabel={'...'}
            disabledClassName={'disabled'}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ItemCategoryCard;