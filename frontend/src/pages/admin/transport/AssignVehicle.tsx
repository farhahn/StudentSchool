import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent,
  InputAdornment, TextField, Radio, RadioGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVehicles } from '../../../redux/TransportRelated/vehicleAction';
import { getAllTransportRoutes } from '../../../redux/TransportRelated/routeHandle';
import { getAllAssignments, createAssignment, updateAssignment, deleteAssignment, clearAssignmentError } from '../../../redux/TransportRelated/AssignmentAction';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';

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

const AssignmentCard = styled(Card)`
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

const AssignVehicle = () => {
  const dispatch = useDispatch();
  const vehicleState = useSelector((state) => state.vehicle || { vehiclesList: [], loading: false, error: null });
  const transportRouteState = useSelector((state) => state.transportRoute || { transportRoutesList: [], loading: false, error: null });
  const assignmentState = useSelector((state) => state.assignment || { assignmentsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { vehiclesList, loading: vehicleLoading } = vehicleState;
  const { transportRoutesList, loading: routeLoading } = transportRouteState;
  const { assignmentsList, loading: assignmentLoading, error } = assignmentState;
  const adminID = userState.currentUser?._id;

  // State for form, pagination, and dialog
  const [formData, setFormData] = useState({ route: '', vehicle: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Refs for form fields
  const routeRef = useRef(null);
  const vehicleRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch data
  useEffect(() => {
    if (adminID) {
      dispatch(getAllVehicles(adminID));
      dispatch(getAllTransportRoutes(adminID));
      dispatch(getAllAssignments(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view assignments', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearAssignmentError());
    }
  }, [error, dispatch]);

  // Focus on route field when dialog opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => routeRef.current?.focus(), 0);
    }
  }, [isPopupOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Enter key navigation
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        handleSave();
      }
    }
  };

  const handleAdd = () => {
    setFormData({ route: '', vehicle: '' });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setFormData({ route: '', vehicle: '' });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to save assignments', severity: 'error' });
      return;
    }
    if (!formData.route || !formData.vehicle) {
      setSnack({ open: true, message: 'Route and vehicle are required', severity: 'warning' });
      return;
    }
    // Check for duplicate assignments (same route and vehicle)
    const duplicate = assignmentsList.some(
      (a) => a.routeId === formData.route && a.vehicleId === formData.vehicle && a._id !== editId
    );
    if (duplicate) {
      setSnack({ open: true, message: 'This route is already assigned to this vehicle', severity: 'warning' });
      return;
    }
    const action = editId ? updateAssignment({ id: editId, assignment: formData, adminID }) : createAssignment(formData, adminID);
    dispatch(action)
      .then(() => {
        setSnack({
          open: true,
          message: editId ? 'Assignment updated successfully' : 'Assignment created successfully',
          severity: 'success',
        });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page
      })
      .catch((err) => {
        setSnack({
          open: true,
          message: err.message || (editId ? 'Failed to update assignment' : 'Failed to create assignment'),
          severity: 'error',
        });
      });
  };

  const handleEdit = (assignment) => {
    setEditId(assignment._id);
    setFormData({ route: assignment.routeId, vehicle: assignment.vehicleId });
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete assignments', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      dispatch(deleteAssignment(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Assignment deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page
        })
        .catch((err) => {
          setSnack({
            open: true,
            message: err.message || 'Failed to delete assignment',
            severity: 'error',
          });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting assignments as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing assignments', severity: 'info' });
  };

  const handleSettings = () => {
    setSnack({ open: true, message: 'Settings functionality not implemented', severity: 'warning' });
  };

  // Map IDs to names for display
  const getRouteName = (routeId) => transportRoutesList.find((route) => route._id === routeId)?.title || 'Unknown';
  const getVehicleName = (vehicleId) => vehiclesList.find((vehicle) => vehicle._id === vehicleId)?.number || 'Unknown';

  // Pagination logic
  const filteredAssignments = assignmentsList.filter((assignment) =>
    getRouteName(assignment.routeId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleName(assignment.vehicleId)?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredAssignments.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredAssignments.map((assignment) => ({
    Route: getRouteName(assignment.routeId),
    Vehicle: getVehicleName(assignment.vehicleId),
  }));

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { borderRadius: '12px' } }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%', fontWeight: 500 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      <Heading variant="h4">Vehicle Assignment Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AssignmentCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Assignment List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="vehicle-assignments.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                    + Add New Assignment
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search assignments"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#34495e' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Route
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Vehicle
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentLoading || vehicleLoading || routeLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          No assignments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((assignment) => (
                        <StyledTableRow key={assignment._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {getRouteName(assignment.routeId)}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {getVehicleName(assignment.vehicleId)}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEdit({ ...assignment, routeId: assignment.routeId, vehicleId: assignment.vehicleId })}
                              sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(assignment._id)}
                              sx={{ color: '#e74c3c', '&:hover': { backgroundColor: '#f5b7b1', transform: 'scale(1.1)' } }}
                              title="Delete"
                            />
                              <DeleteIcon fontSize="small" />
                            </TableCell>
                          
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <PaginationContainer>
                <Typography sx={{ color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredAssignments.length} records
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
            </CardContent>
          </AssignmentCard>
        </Grid>
      </Grid>

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
          {editId ? 'Edit Assignment' : 'Add New Assignment'}
        </DialogTitle>
        <DialogContentStyled>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }} variant="outlined">
            <InputLabel>Route</InputLabel>
            <Select
              name="route"
              value={formData.route}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, vehicleRef)}
              label="Route"
              size="small"
              inputRef={routeRef}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {transportRoutesList.map((route) => (
                <MenuItem key={route._id} value={route._id}>{route.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1a2526' }}>
              Vehicle
            </Typography>
            <RadioGroup
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
              ref={vehicleRef}
            >
              {vehiclesList.map((vehicle) => (
                <FormControlLabel
                  key={vehicle._id}
                  value={vehicle._id}
                  control={<Radio size="small" />}
                  label={vehicle.number}
                />
              ))}
            </RadioGroup>
          </FormControl>
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

export default AssignVehicle;