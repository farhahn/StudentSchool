import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Snackbar, Alert, IconButton, MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, Save as SaveIcon, Undo as UndoIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllExpenseHeads, createExpenseHead, updateExpenseHead, deleteExpenseHead, clearExpenseHeadError,
} from '../../../redux/expenseRelated/expenseHeadHandle';

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

const Form = styled('form')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr auto;
  }
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

const ListContainer = styled(Box)`
  overflow-x: auto;
`;

const ListItem = styled.div`
  display: grid;
  grid-template-columns: ${props => props.editing ? '1fr 1fr auto auto' : '1fr 2fr auto auto'};
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s ease;
  gap: 10px;
  font-size: 0.875rem;

  &:hover {
    background: #f9f9f9;
  }

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }

  .MuiInputBase-input {
    padding: 6px;
    font-size: 0.875rem;
    @media (max-width: 600px) {
      font-size: 0.75rem;
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

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const ExpenseHeadPage = () => {
  const [newHead, setNewHead] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expenseHeadsList, loading, error } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenseHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view expense heads', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseHeadError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add expense heads', severity: 'error' });
      return;
    }
    if (!newHead.trim() || !newDescription.trim()) {
      setSnack({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }
    dispatch(createExpenseHead({ name: newHead, description: newDescription }, adminID))
      .then(() => {
        setNewHead('');
        setNewDescription('');
        setSnack({ open: true, message: 'Expense head added successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to add expense head', severity: 'error' });
      });
  };

  const toggleStatus = (id, active) => {
    dispatch(updateExpenseHead({ id, expenseHead: { active: !active }, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Status updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update status', severity: 'error' });
      });
  };

  const deleteHead = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete expense heads', severity: 'error' });
      return;
    }
    dispatch(deleteExpenseHead(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Expense head deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to delete expense head', severity: 'error' });
      });
  };

  const startEditing = (head) => {
    setEditingId(head._id);
    setEditName(head.name);
    setEditDescription(head.description);
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
    dispatch(updateExpenseHead({ id: editingId, expenseHead: { name: editName, description: editDescription }, adminID }))
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
        setSnack({ open: true, message: 'Expense head updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update expense head', severity: 'error' });
      });
  };

  const filteredHeads = expenseHeadsList.filter((head) =>
    head.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    head.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredHeads.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredHeads.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

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
      <Heading variant="h4">Expense Head Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <SubHeading variant="h6">Add Expense Head</SubHeading>
              <Form onSubmit={handleSubmit}>
                <TextField
                  label="Expense Head"
                  value={newHead}
                  onChange={(e) => setNewHead(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ 'aria-label': 'Expense Head Name' }}
                />
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ 'aria-label': 'Expense Head Description' }}
                />
                <SaveButton
                  type="submit"
                  variant="contained"
                  aria-label="Save Expense Head"
                >
                  Save
                </SaveButton>
              </Form>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <SubHeading variant="h6">Expense Head List</SubHeading>
              <TextField
                fullWidth
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                inputProps={{ 'aria-label': 'Search Expense Heads' }}
                sx={{ mb: 2 }}
              />
              <ListContainer>
                {loading ? (
                  <Typography textAlign="center" sx={{ color: '#1a2526' }}>Loading...</Typography>
                ) : currentPageData.length === 0 ? (
                  <Typography textAlign="center" sx={{ color: '#999' }}>No expense heads found</Typography>
                ) : (
                  currentPageData.map((head) => (
                    <ListItem key={head._id} editing={editingId === head._id}>
                      {editingId === head._id ? (
                        <>
                          <TextField
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            variant="outlined"
                            size="small"
                            inputProps={{ 'aria-label': 'Edit Expense Head Name' }}
                          />
                          <TextField
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            variant="outlined"
                            size="small"
                            inputProps={{ 'aria-label': 'Edit Expense Head Description' }}
                          />
                        </>
                      ) : (
                        <>
                          <Typography sx={{ color: '#1a2526' }}>{head.name}</Typography>
                          <Typography sx={{ color: '#1a2526' }}>{head.description}</Typography>
                        </>
                      )}
                      <StatusIndicator
                        active={head.active}
                        onClick={() => toggleStatus(head._id, head.active)}
                        aria-label={head.active ? 'Deactivate Expense Head' : 'Activate Expense Head'}
                      >
                        {head.active ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        {head.active ? 'Active' : 'Inactive'}
                      </StatusIndicator>
                      <ActionContainer>
                        {editingId === head._id ? (
                          <>
                            <IconButton
                              onClick={saveEdit}
                              aria-label="Save Edited Expense Head"
                              sx={{ color: '#4CAF50' }}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={cancelEditing}
                              aria-label="Cancel Editing"
                              sx={{ color: '#f44336' }}
                            >
                              <UndoIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              onClick={() => startEditing(head)}
                              aria-label="Edit Expense Head"
                              sx={{ color: '#1976d2' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => deleteHead(head._id)}
                              aria-label="Delete Expense Head"
                              sx={{ color: '#d32f2f' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </ActionContainer>
                    </ListItem>
                  ))
                )}
              </ListContainer>
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredHeads.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <Box sx={{ minWidth: 80 }}>
                    <TextField
                      select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      variant="outlined"
                      size="small"
                      inputProps={{ 'aria-label': 'Items per page' }}
                    >
                      {[5, 10, 20, 30].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
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

export default ExpenseHeadPage;