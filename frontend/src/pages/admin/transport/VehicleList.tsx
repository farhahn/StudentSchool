import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, clearVehicleError } from '../../../redux/TransportRelated/vehicleAction';
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

const VehicleCard = styled(Card)`
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

const VehicleList = () => {
  const dispatch = useDispatch();
  const vehicleState = useSelector((state) => state.vehicle || { vehiclesList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { vehiclesList, loading, error } = vehicleState;
  const adminID = userState.currentUser?._id;

  // State for form, pagination, and dialog
  const [vehicle, setVehicle] = useState({
    number: '', model: '', year: '', regNumber: '', chassis: '', capacity: '', driver: '', license: '', contact: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Refs for form fields
  const numberRef = useRef(null);
  const modelRef = useRef(null);
  const yearRef = useRef(null);
  const regNumberRef = useRef(null);
  const chassisRef = useRef(null);
  const capacityRef = useRef(null);
  const driverRef = useRef(null);
  const licenseRef = useRef(null);
  const contactRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch vehicles
  useEffect(() => {
    if (adminID) {
      dispatch(getAllVehicles(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view vehicles', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearVehicleError());
    }
  }, [error, dispatch]);

  // Focus on first field when dialog opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => numberRef.current?.focus(), 0);
    }
  }, [isPopupOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
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
    setVehicle({
      number: '', model: '', year: '', regNumber: '', chassis: '', capacity: '', driver: '', license: '', contact: '',
    });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setVehicle({
      number: '', model: '', year: '', regNumber: '', chassis: '', capacity: '', driver: '', license: '', contact: '',
    });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit vehicles', severity: 'error' });
      return;
    }
    if (!vehicle.number || !vehicle.model || !vehicle.year || !vehicle.regNumber || !vehicle.chassis ||
        !vehicle.capacity || !vehicle.driver || !vehicle.license || !vehicle.contact) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    // Additional validations
    const year = parseInt(vehicle.year);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      setSnack({ open: true, message: `Year must be between 1900 and ${new Date().getFullYear() + 1}`, severity: 'warning' });
      return;
    }
    const capacity = parseInt(vehicle.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setSnack({ open: true, message: 'Capacity must be a positive number', severity: 'warning' });
      return;
    }
    const contactRegex = /^\+?\d{10,15}$/;
    if (!contactRegex.test(vehicle.contact)) {
      setSnack({ open: true, message: 'Contact number must be 10-15 digits', severity: 'warning' });
      return;
    }

    const duplicate = vehiclesList?.some(
      (v) => (v.number.toLowerCase() === vehicle.number.toLowerCase() ||
              v.regNumber.toLowerCase() === vehicle.regNumber.toLowerCase() ||
              v.chassis.toLowerCase() === vehicle.chassis.toLowerCase()) && v._id !== editId
    );
    if (duplicate) {
      setSnack({ open: true, message: 'Vehicle number, registration, or chassis already exists!', severity: 'warning' });
      return;
    }

    const action = editId ? updateVehicle({ id: editId, vehicle, adminID }) : createVehicle(vehicle, adminID);
    dispatch(action)
      .then(() => {
        setSnack({
          open: true,
          message: editId ? 'Vehicle updated successfully' : 'Vehicle created successfully',
          severity: 'success',
        });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page
      })
      .catch((err) => {
        setSnack({
          open: true,
          message: err.message || (editId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const handleEdit = (v) => {
    setEditId(v._id);
    setVehicle({
      number: v.number,
      model: v.model,
      year: v.year,
      regNumber: v.regNumber,
      chassis: v.chassis,
      capacity: v.capacity,
      driver: v.driver,
      license: v.license,
      contact: v.contact,
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete vehicles', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      dispatch(deleteVehicle(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Vehicle deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page
        })
        .catch(() => {
          setSnack({ open: true, message: 'Delete failed', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting vehicles as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing vehicles', severity: 'info' });
  };

  // Pagination logic
  const filteredVehicles = (vehiclesList || []).filter((v) =>
    v.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredVehicles.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredVehicles.map((v) => ({
    'Vehicle Number': v.number,
    Model: v.model,
    Year: v.year,
    'Registration Number': v.regNumber,
    'Chassis Number': v.chassis,
    Capacity: v.capacity,
    Driver: v.driver,
    License: v.license,
    Contact: v.contact,
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
      <Heading variant="h4">Vehicle Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <VehicleCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Vehicle List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="vehicles.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                  <AddButton variant="contained" onClick={handleAdd}>
                    + Add New Vehicle
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search vehicles"
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
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#34495e' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Vehicle #
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Model
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Year
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Reg. #
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Chassis
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Cap.
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Driver
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        License
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Contact
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          No vehicles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((v) => (
                        <StyledTableRow key={v._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.number}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.model}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.year}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.regNumber}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.chassis}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.capacity}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.driver}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.license}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {v.contact}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEdit(v)}
                              sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(v._id)}
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
                  Showing {currentPageData.length} of {filteredVehicles.length} records
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
          </VehicleCard>
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
          {editId ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <DialogContentStyled>
          <TextField
            fullWidth
            label="Vehicle Number"
            name="number"
            value={vehicle.number}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, modelRef)}
            variant="outlined"
            size="small"
            required
            inputRef={numberRef}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Model"
            name="model"
            value={vehicle.model}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, yearRef)}
            variant="outlined"
            size="small"
            required
            inputRef={modelRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={vehicle.year}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, regNumberRef)}
            variant="outlined"
            size="small"
            required
            inputRef={yearRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
          />
          <TextField
            fullWidth
            label="Registration Number"
            name="regNumber"
            value={vehicle.regNumber}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, chassisRef)}
            variant="outlined"
            size="small"
            required
            inputRef={regNumberRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Chassis Number"
            name="chassis"
            value={vehicle.chassis}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, capacityRef)}
            variant="outlined"
            size="small"
            required
            inputRef={chassisRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={vehicle.capacity}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, driverRef)}
            variant="outlined"
            size="small"
            required
            inputRef={capacityRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Driver Name"
            name="driver"
            value={vehicle.driver}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, licenseRef)}
            variant="outlined"
            size="small"
            required
            inputRef={driverRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="License Number"
            name="license"
            value={vehicle.license}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, contactRef)}
            variant="outlined"
            size="small"
            required
            inputRef={licenseRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={vehicle.contact}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
            variant="outlined"
            size="small"
            required
            inputRef={contactRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
          />
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

export default VehicleList;