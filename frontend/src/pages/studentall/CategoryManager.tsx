import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Snackbar, Alert, IconButton,
  FormControl, Select, MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, Save as SaveIcon, Undo as UndoIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCategories, createCategory, updateCategory, deleteCategory, clearCategoryError,
} from '../../redux/categoryRelated/categoryHandle';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { RootState, AppDispatch } from '../../redux/store';

// Styled Components
const ListItem = styled.div`
  display: grid;
  grid-template-columns: ${props => props.editing ? '1fr 1fr auto auto' : '1fr 2fr auto auto'};
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s ease;
  gap: 10px;

  &:hover {
    background: #f9f9f9;
  }

  input {
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }

  svg {
    margin-left: 10px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease;
    
    &:hover {
      color: #333;
    }
  }
`;

const StatusIndicator = styled.span`
  color: ${props => props.active ? '#4CAF50' : '#f44336'};
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const CategoryManager: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const dispatch = useDispatch<AppDispatch>();
  const stableDispatch = useCallback(dispatch, []);
  const { categories, loading, error } = useSelector((state: RootState) => {
    console.log('Redux state in useSelector:', JSON.stringify(state, null, 2));
    return state.category;
  });
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    console.log('useEffect triggered with adminID:', adminID);
    console.log('Categories state:', JSON.stringify(categories, null, 2));
    console.log('Loading:', loading, 'Error:', error);
    if (adminID) {
      stableDispatch(fetchAllCategories(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view categories', severity: 'error' });
    }
  }, [stableDispatch, adminID]);

  useEffect(() => {
    if (error) {
      console.log('Error detected:', error);
      setSnack({ open: true, message: error, severity: 'error' });
      stableDispatch(clearCategoryError());
    }
  }, [error, stableDispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add categories', severity: 'error' });
      return;
    }
    if (!newCategory.trim() || !newDescription.trim()) {
      setSnack({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }
    if (categories.some((cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      setSnack({ open: true, message: 'Category name already exists', severity: 'warning' });
      return;
    }

    stableDispatch(createCategory({ name: newCategory, description: newDescription }, adminID))
      .then(() => {
        setNewCategory('');
        setNewDescription('');
        setSearchQuery('');
        setSnack({ open: true, message: 'Category added successfully', severity: 'success' });
        stableDispatch(clearCategoryError());
      })
      .catch((err) => {
        const errorMessage = err.message.includes('E11000') 
          ? 'Category name already exists in the database'
          : 'Failed to add category';
        console.error('Create category error:', err);
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      });
  };

  const toggleStatus = (id: string, active: boolean) => {
    stableDispatch(updateCategory({ id, category: { active: !active }, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Status updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update status', severity: 'error' });
      });
  };

  const deleteCategoryHandler = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete categories', severity: 'error' });
      return;
    }
    stableDispatch(deleteCategory(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Category deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to delete category', severity: 'error' });
      });
  };

  const startEditing = (category: { _id: string; name: string; description: string }) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = () => {
    if (!editName.trim() || !editDescription.trim()) {
      setSnack({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }
    stableDispatch(updateCategory({ id: editingId!, category: { name: editName, description: editDescription }, adminID }))
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
        setSnack({ open: true, message: 'Category updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update category', severity: 'error' });
      });
  };

  const filteredCategories = categories.filter((category) =>
    (typeof category.name === 'string' ? category.name.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
    (typeof category.description === 'string' ? category.description.toLowerCase() : '').includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredCategories.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1a2526',
          mb: 4,
          fontSize: { xs: '1.5rem', md: '2.125rem' },
        }}
      >
        Category Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Add Category
              </Typography>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', marginBottom: '20px' }}>
                <TextField
                  label="Category Name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{ 'aria-label': 'Category Name' }}
                />
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{ 'aria-label': 'Category Description' }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                  aria-label="Save Category"
                >
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Category List
              </Typography>
              <TextField
                fullWidth
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ 'aria-label': 'Search Categories' }}
              />
              {loading ? (
                <Typography textAlign="center">Loading...</Typography>
              ) : filteredCategories.length === 0 ? (
                <Typography textAlign="center">No categories found</Typography>
              ) : (
                currentPageData.map((category) => (
                  <ListItem key={category._id} editing={editingId === category._id}>
                    {editingId === category._id ? (
                      <>
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          variant="outlined"
                          size="small"
                          aria-label="Edit Category Name"
                        />
                        <TextField
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          variant="outlined"
                          size="small"
                          aria-label="Edit Category Description"
                        />
                      </>
                    ) : (
                      <>
                        <div>{category.name}</div>
                        <div>{category.description}</div>
                      </>
                    )}
                    <StatusIndicator active={category.active} onClick={() => toggleStatus(category._id, category.active)}>
                      {category.active ? <CheckIcon /> : <CloseIcon />}
                      {category.active ? 'Active' : 'Inactive'}
                    </StatusIndicator>
                    <ActionContainer>
                      {editingId === category._id ? (
                        <>
                          <IconButton onClick={saveEdit} sx={{ color: '#4CAF50' }} aria-label="Save Category">
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={cancelEditing} sx={{ color: '#f44336' }} aria-label="Cancel Edit">
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => startEditing(category)} sx={{ color: '#1976d2' }} aria-label="Edit Category">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => deleteCategoryHandler(category._id)} sx={{ color: '#d32f2f' }} aria-label="Delete Category">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </ActionContainer>
                  </ListItem>
                ))
              )}
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredCategories.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <FormControl variant="outlined" size="small">
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      aria-label="Items per page"
                    >
                      {[5, 10, 20, 30].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
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
                />
              </PaginationContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
      <style jsx global>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .page {
          margin: 0 3px;
        }
        .page-link {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f9f9f9;
          color: #1a2526;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: 14px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .page-link:hover {
          background-color: #e0e0e0;
        }
        .active .page-link {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
          font-weight: bold;
        }
        @media (max-width: 600px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
        @media (max-width: 900px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </Box>
  );
};

export default CategoryManager;