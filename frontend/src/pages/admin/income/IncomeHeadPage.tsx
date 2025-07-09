import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, FormControl, Select, MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  fetchIncomeHeads,
  addIncomeHead,
  updateIncomeHead,
  deleteIncomeHead,
  clearError,
} from '../../../redux/IncomeRelated/IncomeActions';

interface IncomeHead {
  _id: string;
  name: string;
  description: string;
}

interface RootState {
  income: {
    incomeHeads: IncomeHead[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

// Styled Components
const Container = styled(Box)`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #e8c897;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled('form')`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled(TextField)`
  width: 100%;
  & .MuiInputBase-input {
    padding: 8px;
    font-size: 14px;
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${(props: { editMode: boolean }) => (props.editMode ? '#ffc107' : '#28a745')};
  color: ${(props: { editMode: boolean }) => (props.editMode ? '#212529' : 'white')};
  padding: 10px 20px;
  border-radius: 4px;
  text-transform: none;
  font-size: 14px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled(TextField)`
  width: 100%;
  & .MuiInputBase-input {
    padding: 8px;
    font-size: 14px;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f1f1f1;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const IncomeHeadPage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { incomeHeads, loading, error } = useSelector((state: RootState) => state.income || {});
  const adminID = currentUser?._id;

  const [searchTerm, setSearchTerm] = useState('');
  const [newHead, setNewHead] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  useEffect(() => {
    if (adminID) {
      dispatch(fetchIncomeHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view income heads', severity: 'error' });
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredHeads = incomeHeads.filter(head =>
    head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    head.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHead.trim() || !newDescription.trim()) {
      setSnack({ open: true, message: 'Income head and description are required', severity: 'warning' });
      return;
    }

    const headData = { name: newHead, description: newDescription };

    try {
      if (editingId) {
        await dispatch(updateIncomeHead({ id: editingId, headData, adminID })).unwrap();
        setSnack({ open: true, message: 'Income head updated successfully', severity: 'success' });
      } else {
        await dispatch(addIncomeHead({ headData, adminID })).unwrap();
        setSnack({ open: true, message: 'Income head added successfully', severity: 'success' });
      }
      setNewHead('');
      setNewDescription('');
      setEditingId(null);
    } catch (error: any) {
      setSnack({
        open: true,
        message: error.message || 'Failed to save income head',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteIncomeHead({ id, adminID })).unwrap();
      setSnack({ open: true, message: 'Income head deleted successfully', severity: 'success' });
    } catch (error: any) {
      setSnack({
        open: true,
        message: error.message || 'Failed to delete income head',
        severity: 'error',
      });
    }
  };

  const handleEdit = (head: IncomeHead) => {
    setNewHead(head.name);
    setNewDescription(head.description);
    setEditingId(head._id);
  };

  const pageCount = Math.ceil(filteredHeads.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredHeads.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
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
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Income Head *</Label>
          <Input
            type="text"
            value={newHead}
            onChange={(e) => setNewHead(e.target.value)}
            placeholder="Income Head"
            required
            inputProps={{ 'aria-label': 'Income Head' }}
            fullWidth
          />
        </FormGroup>
        <FormGroup>
          <Label>Description *</Label>
          <Input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
            required
            inputProps={{ 'aria-label': 'Description' }}
            fullWidth
          />
        </FormGroup>
        <SubmitButton
          type="submit"
          variant="contained"
          editMode={!!editingId}
          aria-label={editingId ? 'Update Income Head' : 'Add Income Head'}
        >
          {editingId ? 'Update Income Head' : 'Add Income Head'}
        </SubmitButton>
      </StyledForm>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'Search Income Heads' }}
          fullWidth
        />
      </SearchContainer>

      {loading ? (
        <Typography sx={{ textAlign: 'center', color: '#1a2526', fontSize: '16px', margin: '20px 0' }}>
          Loading...
        </Typography>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#1a2526' }}>Income Head</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1a2526' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1a2526' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((head) => (
                  <StyledTableRow key={head._id}>
                    <TableCell>{head.name}</TableCell>
                    <TableCell>{head.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(head)} aria-label="Edit Income Head">
                        <EditIcon sx={{ color: '#2196F3', fontSize: '16px' }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(head._id)} aria-label="Delete Income Head">
                        <DeleteIcon sx={{ color: '#dc3545', fontSize: '16px' }} />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#999' }}>
                    No income heads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
      <PaginationContainer>
        <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
          Showing {currentPageData.length} of {filteredHeads.length} records
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

export default IncomeHeadPage;