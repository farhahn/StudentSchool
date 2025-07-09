import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllExamGroups,
  createExamGroup,
  updateExamGroup,
  deleteExamGroup,
  clearExamGroupError,
} from '../../../redux/examRelated/exam-group-actions';

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

const FormCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #d3e0ff;
`;

const TableCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const SubHeading = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a2526;
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddUpdateButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #2e7d32;
  color: white;
  &:hover {
    background-color: #1b5e20;
  }
`;

const AddExamButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #115293;
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

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const examTypes = [
  'General Purpose (Pass/Fail)',
  'School Based Grading System',
  'College Based Grading System',
  'GPA Grading System',
  'Average Passing',
];

const GroupExam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const examGroupState = useSelector((state) => state.examGroup || { examGroupsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { examGroupsList, loading, error } = examGroupState;
  const adminID = userState.currentUser?._id;

  const [formData, setFormData] = useState({ name: '', type: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);

  // Refs for form fields and button
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const descriptionRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamGroups(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam groups', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExamGroupError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to manage exam groups', severity: 'error' });
      return;
    }
    if (!formData.name || !formData.type) {
      setSnack({ open: true, message: 'Name and type are required', severity: 'warning' });
      return;
    }
    if (isEditing) {
      dispatch(updateExamGroup({ id: editId, examGroup: formData, adminID }))
        .then(() => {
          setSnack({ open: true, message: 'Exam group updated successfully', severity: 'success' });
          setFormData({ name: '', type: '', description: '' });
          setIsEditing(false);
          setEditId(null);
          nameRef.current.focus(); // Return focus to Name field after submit
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to update exam group', severity: 'error' });
        });
    } else {
      dispatch(createExamGroup(formData, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam group added successfully', severity: 'success' });
          setFormData({ name: '', type: '', description: '' });
          nameRef.current.focus(); // Return focus to Name field after submit
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to add exam group', severity: 'error' });
        });
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or new line in multiline TextField
      if (nextRef && nextRef.current) {
        if (nextRef === typeRef) {
          // For Select, focus and open the dropdown
          setIsTypeSelectOpen(true);
          typeRef.current.focus();
        } else {
          nextRef.current.focus();
        }
      } else {
        // If on the last field (submit button), trigger submit
        handleSubmit();
      }
    }
  };

  const handleEdit = (group) => {
    setFormData({ name: group.name, type: group.type, description: group.description });
    setIsEditing(true);
    setEditId(group._id);
    nameRef.current.focus(); // Focus Name field when starting edit
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete exam groups', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this exam group?')) {
      dispatch(deleteExamGroup(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam group deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete exam group', severity: 'error' });
        });
    }
  };

  const handleNavigateToAddExam = () => {
    navigate('/add-exam');
  };

  const pageCount = Math.ceil(examGroupsList.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = examGroupsList.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <Heading variant="h4">Exam Group Management</Heading>
      <Grid container spacing={3}>
        {/* Add/Edit Exam Group Section */}
        <Grid item xs={12} md={4}>
          <FormCard>
            <CardContent>
              <SubHeading variant="h6">{isEditing ? 'Edit Exam Group' : 'Add Exam Group'}</SubHeading>
              <FormContainer>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, typeRef)}
                  variant="outlined"
                  size="small"
                  required
                  inputProps={{ 'aria-label': 'Exam Group Name' }}
                  inputRef={nameRef}
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="exam-type-label">Exam Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                    open={isTypeSelectOpen}
                    onOpen={() => setIsTypeSelectOpen(true)}
                    onClose={() => setIsTypeSelectOpen(false)}
                    label="Exam Type"
                    labelId="exam-type-label"
                    required
                    aria-label="Exam Type"
                    inputRef={typeRef}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {examTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={3}
                  inputProps={{ 'aria-label': 'Exam Group Description' }}
                  inputRef={descriptionRef}
                />
                <AddUpdateButton
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<AddIcon />}
                  aria-label={isEditing ? 'Update Exam Group' : 'Add Exam Group'}
                  ref={submitButtonRef}
                >
                  {isEditing ? 'Update' : 'Add'} Exam Group
                </AddUpdateButton>
              </FormContainer>
            </CardContent>
          </FormCard>
        </Grid>

        {/* Exam Group List Section */}
        <Grid item xs={12} md={8}>
          <TableCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <SubHeading variant="h6">Exam Group List</SubHeading>
                <AddExamButton
                  variant="contained"
                  onClick={handleNavigateToAddExam}
                  startIcon={<AddIcon />}
                  aria-label="Add Examination Name"
                >
                  Add Examination Name
                </AddExamButton>
              </Box>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        No. of Exams
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Type
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#1a2526' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam groups found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((group, idx) => (
                        <StyledTableRow key={group._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.exams}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.type}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.description}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleEdit(group)}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              aria-label="Edit Exam Group"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(group._id)}
                              sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                              aria-label="Delete Exam Group"
                            >
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
                  Showing {currentPageData.length} of {examGroupsList.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="items-per-page-label">Items</InputLabel>
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      label="Items"
                      labelId="items-per-page-label"
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
          </TableCard>
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

export default GroupExam;