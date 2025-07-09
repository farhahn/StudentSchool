import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Skeleton, Fade,
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useDebounce } from 'use-debounce';
import { createSelector } from 'reselect';
import {
  fetchIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
  fetchIncomeHeads,
  clearError,
} from '../../../redux/IncomeRelated/IncomeActions';

interface Income {
  _id: string;
  incomeHead: string;
  name: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  document: string | null;
  description: string;
}

interface IncomeHead {
  _id: string;
  name: string;
  description: string;
}

interface RootState {
  income: {
    incomes: Income[];
    incomeHeads: IncomeHead[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

// Redux Selectors
const selectIncomeState = (state: RootState) => state.income;
const selectUserState = (state: RootState) => state.user;

const selectIncomes = createSelector([selectIncomeState], (income) => income?.incomes || []);
const selectIncomeHeads = createSelector([selectIncomeState], (income) => income?.incomeHeads || []);
const selectLoading = createSelector([selectIncomeState], (income) => income?.loading || false);
const selectError = createSelector([selectIncomeState], (income) => income?.error || null);
const selectAdminID = createSelector([selectUserState], (user) => user?.currentUser?._id);

const AddIncome: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector(selectIncomes);
  const incomeHeads = useSelector(selectIncomeHeads);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const adminID = useSelector(selectAdminID);

  const initialFormData = {
    incomeHead: '',
    name: '',
    invoiceNumber: '',
    date: '',
    amount: '',
    document: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [debouncedFormData] = useDebounce(formData, 300);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

  useEffect(() => {
    console.log('AddIncome useEffect: Preparing to fetch data'); // Debug log
    if (adminID) {
      // Delay fetch to allow UI to stabilize
      const timer = setTimeout(() => {
        console.log('AddIncome useEffect: Fetching data'); // Debug log
        dispatch(fetchIncomes(adminID));
        dispatch(fetchIncomeHeads(adminID));
      }, 100);
      return () => clearTimeout(timer); // Cleanup
    } else {
      setSnack({ open: true, message: 'Please log in to view incomes', severity: 'error' });
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): string | null => {
    if (!debouncedFormData.incomeHead.trim()) return 'Income head is required';
    if (!debouncedFormData.name.trim()) return 'Name is required';
    if (!debouncedFormData.date) return 'Date is required';
    if (!debouncedFormData.amount || parseFloat(debouncedFormData.amount) <= 0) return 'Amount must be greater than 0';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fields = ['incomeHead', 'name', 'invoiceNumber', 'date', 'amount', 'document', 'description'];
      if (index < fields.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called'); // Debug log
    const validationError = validateForm();
    if (validationError) {
      setSnack({ open: true, message: validationError, severity: 'warning' });
      return;
    }

    setActionLoading(true);
    const incomeData = {
      _id: editId || `temp-${Date.now()}`, // Temporary ID for optimistic update
      incomeHead: debouncedFormData.incomeHead,
      name: debouncedFormData.name,
      invoiceNumber: debouncedFormData.invoiceNumber,
      date: debouncedFormData.date,
      amount: parseFloat(debouncedFormData.amount),
      document: debouncedFormData.document || null,
      description: debouncedFormData.description || debouncedFormData.name,
    };

    try {
      if (editId) {
        // Optimistic update
        dispatch({
          type: 'income/updateIncomeLocally',
          payload: { id: editId, incomeData },
        });
        await dispatch(updateIncome({ id: editId, incomeData, adminID })).unwrap();
        setSnack({ open: true, message: 'Income updated successfully', severity: 'success' });
      } else {
        // Optimistic update
        dispatch({
          type: 'income/addIncomeLocally',
          payload: incomeData,
        });
        await dispatch(addIncome({ incomeData, adminID })).unwrap();
        setSnack({ open: true, message: 'Income added successfully', severity: 'success' });
      }
      setFormData(initialFormData);
      setEditId(null);
      setOpenDialog(false);
    } catch (error: any) {
      setSnack({
        open: true,
        message: error.message || 'Failed to save income',
        severity: 'error',
      });
      // Revert optimistic update on failure
      dispatch(fetchIncomes(adminID));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (income: Income) => {
    console.log('handleEdit called:', income._id); // Debug log
    setFormData({
      incomeHead: income.incomeHead,
      name: income.name,
      invoiceNumber: income.invoiceNumber,
      date: income.date,
      amount: income.amount.toString(),
      document: income.document || '',
      description: income.description,
    });
    setEditId(income._id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    console.log('handleDelete called:', id); // Debug log
    setActionLoading(true);
    try {
      // Optimistic update
      dispatch({
        type: 'income/deleteIncomeLocally',
        payload: id,
      });
      await dispatch(deleteIncome({ id, adminID })).unwrap();
      setSnack({ open: true, message: 'Income deleted successfully', severity: 'success' });
    } catch (error: any) {
      setSnack({ open: true, message: 'Failed to delete income', severity: 'error' });
      // Revert optimistic update on failure
      dispatch(fetchIncomes(adminID));
    } finally {
      setActionLoading(false);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const pageCount = Math.ceil(incomes.length / itemsPerPage);
  const currentPageData = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return incomes.slice(offset, offset + itemsPerPage);
  }, [incomes, currentPage, itemsPerPage]);

  const IncomeRow = memo(({ entry, onEdit, onDelete }: { entry: Income, onEdit: (income: Income) => void, onDelete: (id: string) => void }) => {
    console.log(`IncomeRow rendering: ${entry._id}`); // Debug log
    return (
      <TableRow sx={{ '&:hover': { bgcolor: '#f1f1f1' }, transition: 'background-color 0.2s' }}>
        <TableCell sx={{ textAlign: 'center' }}>{entry.name}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{entry.description}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{entry.invoiceNumber}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{entry.date}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{entry.incomeHead}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>${entry.amount.toFixed(2)}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <IconButton onClick={() => onEdit(entry)} aria-label="Edit Income" disabled={actionLoading}>
            <FaEdit style={{ color: '#555', fontSize: '16px' }} />
          </IconButton>
          <IconButton onClick={() => onDelete(entry._id)} aria-label="Delete Income" disabled={actionLoading}>
            <FaTrash style={{ color: '#555', fontSize: '16px' }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  const renderFormFields = () => {
    const fields = [
      { name: 'incomeHead', label: 'Income Head *', type: 'select', options: incomeHeads.map(head => head.name) },
      { name: 'name', label: 'Name *', type: 'text' },
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
      { name: 'date', label: 'Date *', type: 'date' },
      { name: 'amount', label: 'Amount ($) *', type: 'number', step: '0.01', min: '0' },
      { name: 'document', label: 'Document', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
    ];

    return fields.map((field, index) => (
      <Box key={field.name} sx={{ mb: 2 }}>
        <Typography component="label" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: '#333' }}>
          {field.label}
        </Typography>
        {field.type === 'select' ? (
          <FormControl fullWidth>
            <InputLabel id={`${field.name}-label`}>{field.label.replace(' *', '')}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required={field.label.includes('*')}
              inputRef={(el: HTMLSelectElement) => (inputRefs.current[index] = el)}
              label={field.label.replace(' *', '')}
              disabled={actionLoading}
              sx={{ '& .MuiInputBase-root': { p: '10px', fontSize: '14px' } }}
            >
              <MenuItem value="">Select</MenuItem>
              {field.options?.map((option: string) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={field.label.replace(' *', '')}
            inputProps={{ step: field.step, min: field.min, 'aria-label': field.label.replace(' *', '') }}
            required={field.label.includes('*')}
            inputRef={(el: HTMLInputElement) => (inputRefs.current[index] = el)}
            fullWidth
            disabled={actionLoading}
            sx={{ '& .MuiInputBase-input': { p: '10px', fontSize: '14px' } }}
          />
        )}
      </Box>
    ));
  };

  console.log('AddIncome rendering'); // Debug log

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        p: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        bgcolor: '#e8c897',
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
        Add Income
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
        disabled={actionLoading}
      >
        Add New Income
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Income' : 'Add Income'}</DialogTitle>
        <DialogContent>
          <form id="income-form" onSubmit={handleSubmit}>
            {renderFormFields()}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error" disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="income-form"
            variant="contained"
            sx={{
              bgcolor: editId ? '#ffc107' : '#28a745',
              color: editId ? '#212529' : 'white',
              '&:hover': { bgcolor: editId ? '#ffb300' : '#1e7e34' },
            }}
            disabled={actionLoading}
            aria-label={editId ? 'Update Income' : 'Add Income'}
          >
            {actionLoading ? 'Saving...' : editId ? 'Update Income' : 'Add Income'}
          </Button>
        </DialogActions>
      </Dialog>
      <Typography
        variant="h2"
        sx={{ fontSize: 18, color: '#1a2526', my: 2 }}
      >
        Description
      </Typography>
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
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                {['Name', 'Description', 'Invoice Number', 'Date', 'Income Head', 'Amount ($)', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#1a2526', textAlign: 'center' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : currentPageData.length > 0 ? (
                currentPageData.map((entry) => (
                  <IncomeRow key={entry._id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#999' }}>
                    No incomes found.
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
          Showing {currentPageData.length} of {incomes.length} records
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

export default AddIncome;