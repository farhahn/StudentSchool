import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllExpenses, createExpense, updateExpense, deleteExpense, clearExpenseError
} from '../../../redux/expenseRelated/expenseHandle';
import { getAllExpenseHeads } from '../../../redux/expenseRelated/expenseHeadHandle';

// Styled Components
const Container = styled(Box)`
  padding: 16px;
  background-color: #f4f6f8;
  min-height: 100vh;
  @media (min-width: 960px) {
    padding: 32px;
  }
`;

const Heading = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #1a2526;
  margin-bottom: 32px;
  font-size: 1.5rem;
  @media (min-width: 960px) {
    font-size: 2.125rem;
  }
`;

const StyledCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const SubHeading = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a2526;
`;

const AddButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #2e7d32;
  color: white;
  &:hover {
    background-color: #1b5e20;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  box-shadow: none;
  background-color: #fff;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

const ModalContainer = styled(Box)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1300;
  @media (min-width: 600px) {
    width: 500px;
    padding: 32px;
  }
`;

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileUploadContainer = styled(Box)`
  border: 2px dashed #1976d2;
  padding: 16px;
  text-align: center;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #2e7d32;
  color: white;
  &:hover {
    background-color: #1b5e20;
  }
`;

const CancelButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #d32f2f;
  color: white;
  &:hover {
    background-color: #b71c1c;
  }
`;

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const AddExpenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    expenseHead: '',
    name: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    attachedFile: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseState = useSelector((state) => state.expense || { expensesList: [], loading: false, error: null });
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expensesList, loading, error } = expenseState;
  const { expenseHeadsList } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenses(adminID));
      dispatch(getAllExpenseHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view expenses', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, attachedFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit expenses', severity: 'error' });
      return;
    }
    if (!formData.expenseHead || !formData.name || !formData.date || !formData.amount) {
      setSnack({ open: true, message: 'All required fields are required', severity: 'warning' });
      return;
    }

    const action = editingId
      ? updateExpense({ id: editingId, expense: formData, adminID })
      : createExpense(formData, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        setSnack({
          open: true,
          message: editingId ? 'Expense updated successfully' : 'Expense created successfully',
          severity: 'success',
        });
        setEditingId(null);
      })
      .catch((error) => {
        setSnack({
          open: true,
          message: error.message || (editingId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setFormData({
      expenseHead: '',
      name: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: '',
      attachedFile: null,
    });
    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setFormData({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0],
      attachedFile: expense.attachedFile || null,
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete expenses', severity: 'error' });
      return;
    }
    dispatch(deleteExpense(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Expense deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredExpenses = expensesList.filter((expense) =>
    Object.values(expense).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredExpenses.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredExpenses.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <Container>
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
      <Heading variant="h4">Expense Management</Heading>
      <Grid container spacing={3}>
        {/* Search Section */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <SubHeading variant="h6">Search Expenses</SubHeading>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                inputProps={{ 'aria-label': 'Search Expenses' }}
              />
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Table and Add Button */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <SubHeading variant="h6">Expense List</SubHeading>
                <AddButton
                  variant="contained"
                  onClick={() => setShowForm(true)}
                  aria-label="Add Expense"
                >
                  + Add Expense
                </AddButton>
              </Box>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Name', 'Description', 'Invoice Number', 'Date', 'Expense Head', 'Amount (₹)', 'Actions'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            p: { xs: 1, md: 2 },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#1a2526' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#999' }}>
                          No expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((expense, idx) => (
                        <StyledTableRow key={expense._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.name}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.description}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.invoiceNumber}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.expenseHead}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>₹{expense.amount.toFixed(2)}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton onClick={() => handleEdit(expense)} aria-label="Edit Expense" sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(expense._id)} aria-label="Delete Expense" sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredExpenses.length} records
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
          </StyledCard>
        </Grid>
      </Grid>

      {/* Form Modal */}
      {showForm && (
        <ModalContainer>
          <SubHeading variant="h6">{editingId ? 'Edit Expense' : 'Add Expense'}</SubHeading>
          <Form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel id="expense-head-label">Expense Head</InputLabel>
              <Select
                name="expenseHead"
                value={formData.expenseHead}
                onChange={handleChange}
                required
                label="Expense Head"
                labelId="expense-head-label"
                size="small"
                aria-label="Expense Head"
              >
                <MenuItem value="">Select</MenuItem>
                {expenseHeadsList
                  .filter((head) => head.active)
                  .map((head) => (
                    <MenuItem key={head._id} value={head.name}>{head.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
              inputProps={{ 'aria-label': 'Expense Name' }}
            />
            <TextField
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              inputProps={{ 'aria-label': 'Invoice Number' }}
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              inputProps={{ 'aria-label': 'Expense Date' }}
            />
            <TextField
              label="Amount (₹)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
              inputProps={{ 'aria-label': 'Amount', step: '0.01', min: '0' }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              size="small"
              inputProps={{ 'aria-label': 'Description' }}
            />
            <FileUploadContainer>
              <input
                type="file"
                id="fileUpload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                aria-label="Upload File"
              />
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <AttachFileIcon /> {formData.attachedFile?.name || formData.attachedFile || 'Drag and drop a file here or click'}
              </label>
            </FileUploadContainer>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <SaveButton
                type="submit"
                variant="contained"
                aria-label={editingId ? 'Save Edited Expense' : 'Save New Expense'}
              >
                Save
              </SaveButton>
              <CancelButton
                variant="contained"
                onClick={() => setShowForm(false)}
                aria-label="Cancel"
              >
                Cancel
              </CancelButton>
            </Box>
          </Form>
        </ModalContainer>
      )}
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
          background: #4caf50;
          color: white;
          border-color: #4caf50;
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
    </Container>
  );
};

export default AddExpenses;