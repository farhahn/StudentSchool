import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, InputAdornment, Snackbar, Alert, Radio, RadioGroup,
  FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllSubjectives, createSubjective, updateSubjective, deleteSubjective, clearSubjectiveError,
} from '../../../redux/subjective/subjectiveHandle';

// Styled Components
const Container = styled(Box)`
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%);
  min-height: 100vh;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  @media (min-width: 960px) {
    padding: 32px;
  }
`;

const Heading = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 32px;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: fadeIn 1s ease-in;
  @media (min-width: 960px) {
    font-size: 2.5rem;
  }
`;

const SubjectiveCard = styled(Paper)`
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const SubHeading = styled(Typography)`
  font-weight: 700;
  color: #34495e;
  font-size: 1.2rem;
  margin-bottom: 16px;
  animation: slideIn 0.8s ease-out;
  @media (min-width: 960px) {
    font-size: 1.5rem;
  }
`;

const SearchContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const AddButton = styled(Button)`
  border-radius: 25px;
  text-transform: none;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #fff;
  font-weight: 600;
  padding: 10px 25px;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
  &:hover {
    background: linear-gradient(45deg, #27ae60, #219653);
    box-shadow: 0 7px 20px rgba(46, 204, 113, 0.6);
    transform: translateY(-3px);
  }
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  border-radius: 25px;
  text-transform: none;
  background-color: #e74c3c;
  color: #fff;
  font-weight: 600;
  padding: 8px 20px;
  &:hover {
    background-color: #c0392b;
  }
  animation: pulse 1.5s infinite;
`;

const SaveButton = styled(Button)`
  border-radius: 25px;
  text-transform: none;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: #fff;
  font-weight: 700;
  padding: 8px 20px;
  &:hover {
    background: linear-gradient(45deg, #2980b9, #1abc9c);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.6);
  }
  animation: bounce 0.8s ease-out;
`;

const StyledTableContainer = styled(TableContainer)`
  box-shadow: none;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  overflow-x: auto;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(even) {
    background-color: #f9fbfd;
  }
  &:hover {
    background-color: #e8f4f8;
    transition: all 0.2s ease;
  }
`;

const DialogContentStyled = styled(DialogContent)`
  padding: 24px;
  background: #f9fbfd;
  max-height: 70vh;
  overflow-y: auto;
`;

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes popIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
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
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const SubjectiveList = () => {
  const dispatch = useDispatch();
  const { subjectivesList, loading, error } = useSelector((state) => state.subjective || { subjectivesList: [], loading: false, error: null });
  const { currentUser } = useSelector((state) => state.user || {});
  const adminID = currentUser?._id;

  // State for form, pagination, and dialog
  const [subjectiveName, setSubjectiveName] = useState('');
  const [subjectiveCode, setSubjectiveCode] = useState('');
  const [subjectiveType, setSubjectiveType] = useState('Theory');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Refs for form fields
  const subjectiveNameRef = useRef(null);
  const subjectiveCodeRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch data
  useEffect(() => {
    if (adminID) {
      dispatch(getAllSubjectives(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view subjects', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      const displayMessage = error.toLowerCase().includes('already exists') ? 'Subject with this code already exists' : error;
      setSnack({ open: true, message: displayMessage, severity: 'error' });
      dispatch(clearSubjectiveError());
    }
  }, [error, dispatch]);

  // Focus on subjective name field when dialog opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => subjectiveNameRef.current?.focus(), 0);
    }
  }, [isPopupOpen]);

  const handleAdd = () => {
    setSubjectiveName('');
    setSubjectiveCode('');
    setSubjectiveType('Theory');
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (subjective) => {
    setEditId(subjective._id);
    setSubjectiveName(subjective.name);
    setSubjectiveCode(subjective.code);
    setSubjectiveType(subjective.type);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setSubjectiveName('');
    setSubjectiveCode('');
    setSubjectiveType('Theory');
  };

  // Handle Enter key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.name === 'subjectiveName') {
        subjectiveCodeRef.current?.focus();
      } else if (e.target.name === 'subjectiveCode') {
        saveButtonRef.current?.focus();
      } else {
        handleSave();
      }
    }
  };

  const handleSave = useCallback(() => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add/update subjects', severity: 'error' });
      return;
    }
    if (!subjectiveName.trim() || !subjectiveCode.trim()) {
      setSnack({ open: true, message: 'Subject name and code are required', severity: 'warning' });
      return;
    }
    const duplicateCode = subjectivesList.some(
      (sub) => sub.code.toLowerCase() === subjectiveCode.trim().toLowerCase() && sub._id !== editId
    );
    const duplicateName = subjectivesList.some(
      (sub) => sub.name.toLowerCase() === subjectiveName.trim().toLowerCase() && sub._id !== editId
    );
    if (duplicateCode) {
      setSnack({ open: true, message: 'Subject code already exists', severity: 'warning' });
      return;
    }
    if (duplicateName) {
      setSnack({ open: true, message: 'Subject name already exists', severity: 'warning' });
      return;
    }

    const payload = {
      name: subjectiveName.trim(),
      code: subjectiveCode.trim(),
      type: subjectiveType,
    };

    const action = editId ? updateSubjective({ id: editId, subjective: payload, adminID }) : createSubjective(payload, adminID);

    dispatch(action)
      .then(() => {
        setSnack({
          open: true,
          message: editId ? 'Subject updated successfully' : 'Subject created successfully',
          severity: 'success',
        });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page
        dispatch(getAllSubjectives(adminID)); // Refresh subject list
      })
      .catch((err) => {
        const errorMessage = err.payload || (editId ? 'Update failed' : 'Creation failed');
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      });
  }, [adminID, subjectiveName, subjectiveCode, subjectiveType, editId, subjectivesList, dispatch]);

  const handleDelete = useCallback((id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete subjects', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this subject?')) {
      dispatch(deleteSubjective(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Subject deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page
          dispatch(getAllSubjectives(adminID)); // Refresh subject list
        })
        .catch(() => {
          setSnack({ open: true, message: 'Delete failed', severity: 'error' });
        });
    }
  }, [adminID, dispatch]);

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting subjects as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing subjects', severity: 'info' });
  };

  const handleSettings = () => {
    setSnack({ open: true, message: 'Settings functionality not implemented', severity: 'warning' });
  };

  // Pagination logic
  const filteredSubjectives = Array.isArray(subjectivesList)
    ? subjectivesList.filter((subjective) =>
        subjective?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subjective?.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredSubjectives.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSubjectives.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredSubjectives.map((sub) => ({
    'Subject Name': sub.name,
    'Subject Code': sub.code,
    Type: sub.type,
  }));

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { borderRadius: '12px' }, zIndex: 1500 }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%', fontWeight: 500 }}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
      <Heading variant="h4">Subject Management</Heading>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <SubjectiveCard>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
              <SubHeading variant="h5">Subject List</SubHeading>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                <CSVLink data={csvData} filename="subjects.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
                  <IconButton
                    sx={{
                      color: '#7f8c8d',
                      backgroundColor: '#ecf0f1',
                      borderRadius: '50%',
                      padding: '10px',
                      '&:hover': { backgroundColor: '#bdc3c7', color: '#2c3e50', transform: 'scale(1.1)' },
                      transition: 'all 0.3s ease',
                    }}
                    title="Export"
                  >
                    <DownloadIcon />
                  </IconButton>
                </CSVLink>
                <IconButton
                  sx={{
                    color: '#7f8c8d',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '50%',
                    padding: '10px',
                    '&:hover': { backgroundColor: '#bdc3c7', color: '#2c3e50', transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={handlePrint}
                  title="Print"
                >
                  <PrintIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: '#7f8c8d',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '50%',
                    padding: '10px',
                    '&:hover': { backgroundColor: '#bdc3c7', color: '#2c3e50', transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={handleSettings}
                  title="Settings"
                >
                  <SettingsIcon />
                </IconButton>
                <AddButton variant="contained" onClick={handleAdd}>
                  + Add New Subject
                </AddButton>
              </Box>
            </Box>
            <SearchContainer>
              <TextField
                fullWidth
                label="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff', '&:hover': { borderColor: '#3498db' } },
                  '& .MuiInputLabel-root': { color: '#7f8c8d' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#7f8c8d' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={() => setCurrentPage(0)}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#115293' },
                }}
              >
                Search
              </Button>
            </SearchContainer>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#34495e' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                      Subject Name
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                      Code
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : currentPageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                        No subjects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((subjective) => (
                      <StyledTableRow key={subjective._id}>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          {subjective.name}
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          {subjective.code}
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          {subjective.type}
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => handleEdit(subjective)}
                            sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(subjective._id)}
                            sx={{ color: '#e74c3c', '&:hover': { backgroundColor: '#f5b7b1', transform: 'scale(1.1)' } }}
                            title="Delete"
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
              <Typography sx={{ color: '#1a2526', textAlign: 'center' }}>
                Showing {currentPageData.length} of {filteredSubjectives.length} subjects
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                <TextField
                  select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 80 }}
                >
                  {[5, 10, 20, 30].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </TextField>
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
          </Box>
        </SubjectiveCard>
      </Box>

      <Dialog
        open={isPopupOpen}
        onClose={handleClosePopup}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            animation: 'popIn 0.5s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            bgcolor: 'linear-gradient(90deg, #3498db, #2980b9)',
            color: '#fff',
            p: 2,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          {editId ? 'Edit Subject' : 'Add New Subject'}
        </DialogTitle>
        <DialogContentStyled>
          <TextField
            fullWidth
            label="Subject Name"
            name="subjectiveName"
            value={subjectiveName}
            onChange={(e) => setSubjectiveName(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            inputRef={subjectiveNameRef}
            sx={{ mt: 2, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            required
          />
          <TextField
            fullWidth
            label="Subject Code"
            name="subjectiveCode"
            value={subjectiveCode}
            onChange={(e) => setSubjectiveCode(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            inputRef={subjectiveCodeRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            required
          />
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#34495e' }}>
            Subject Type
          </Typography>
          <RadioGroup
            row
            value={subjectiveType}
            onChange={(e) => setSubjectiveType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Theory" control={<Radio />} label="Theory" />
            <FormControlLabel value="Practical" control={<Radio />} label="Practical" />
          </RadioGroup>
        </DialogContentStyled>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', background: '#f9fbfd', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
          <CancelButton onClick={handleClosePopup}>Cancel</CancelButton>
          <SaveButton onClick={handleSave} ref={saveButtonRef}>
            {editId ? 'Update' : 'Save'}
          </SaveButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubjectiveList;