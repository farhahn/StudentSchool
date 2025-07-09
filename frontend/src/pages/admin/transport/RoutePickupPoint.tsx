import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoutePickupPoints, createRoutePickupPoint, updateRoutePickupPoint, deleteRoutePickupPoint, clearRoutePickupPointError } from '../../../redux/TransportRelated/route-pickup-pointAction';
import { getAllTransportRoutes } from '../../../redux/TransportRelated/routeHandle';
import { getAllPickupPoints } from '../../../redux/TransportRelated/PickupPointAction';
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

const RouteCard = styled(Card)`
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

const RoutePickupPoint = () => {
  const dispatch = useDispatch();
  const routePickupPointState = useSelector((state) => state.routePickupPoint || { routePickupPointsList: [], loading: false, error: null });
  const transportRouteState = useSelector((state) => state.transportRoute || { transportRoutesList: [], loading: false, error: null });
  const pickupPointState = useSelector((state) => state.pickupPoint || { pickupPointsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { routePickupPointsList, loading } = routePickupPointState;
  const { transportRoutesList } = transportRouteState;
  const { pickupPointsList } = pickupPointState;
  const adminID = userState.currentUser?._id;

  // State for form, pagination, and dialog
  const [pickup, setPickup] = useState({ routeId: '', pointId: '', fee: '', distance: '', time: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Refs for form fields
  const routeRef = useRef(null);
  const pointRef = useRef(null);
  const feeRef = useRef(null);
  const distanceRef = useRef(null);
  const timeRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch data
  useEffect(() => {
    if (adminID) {
      dispatch(getAllRoutePickupPoints(adminID));
      dispatch(getAllTransportRoutes(adminID));
      dispatch(getAllPickupPoints(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view route pickup points', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (routePickupPointState.error) {
      setSnack({ open: true, message: routePickupPointState.error, severity: 'error' });
      dispatch(clearRoutePickupPointError());
    }
  }, [routePickupPointState.error, dispatch]);

  // Focus on route field when dialog opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => routeRef.current?.focus(), 0);
    }
  }, [isPopupOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPickup((prev) => ({ ...prev, [name]: value }));
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
    setPickup({ routeId: transportRoutesList[0]?._id || '', pointId: '', fee: '', distance: '', time: '' });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (pickup) => {
    setEditId(pickup._id);
    setPickup({
      routeId: transportRoutesList.find((route) => route.title === pickup.route)?._id || '',
      pointId: pickupPointsList.find((point) => point.name === pickup.point)?._id || '',
      fee: pickup.fee.toString(),
      distance: pickup.distance.toString(),
      time: pickup.time,
    });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setPickup({ routeId: '', pointId: '', fee: '', distance: '', time: '' });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to save route pickup points', severity: 'error' });
      return;
    }
    if (!pickup.routeId || !pickup.pointId || !pickup.fee || !pickup.distance || !pickup.time) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    const fee = parseFloat(pickup.fee);
    const distance = parseFloat(pickup.distance);
    if (isNaN(fee) || fee <= 0) {
      setSnack({ open: true, message: 'Monthly fee must be a positive number', severity: 'warning' });
      return;
    }
    if (isNaN(distance) || distance <= 0) {
      setSnack({ open: true, message: 'Distance must be a positive number', severity: 'warning' });
      return;
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s?(AM|PM))?$/i;
    if (!timeRegex.test(pickup.time)) {
      setSnack({ open: true, message: 'Pickup time must be in HH:MM or HH:MM AM/PM format', severity: 'warning' });
      return;
    }
    const duplicate = routePickupPointsList.some((route) =>
      route.pickups.some((p) => p.routeId === pickup.routeId && p.pointId === pickup.pointId && p._id !== editId)
    );
    if (duplicate) {
      setSnack({ open: true, message: 'This pickup point is already assigned to this route', severity: 'warning' });
      return;
    }

    const action = editId ? updateRoutePickupPoint({ id: editId, routePickupPoint: pickup, adminID }) : createRoutePickupPoint(pickup, adminID);
    dispatch(action)
      .then(() => {
        setSnack({
          open: true,
          message: editId ? 'Route pickup point updated successfully' : 'Route pickup point added successfully',
          severity: 'success',
        });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page
      })
      .catch((err) => {
        setSnack({
          open: true,
          message: err.message || (editId ? 'Failed to update route pickup point' : 'Failed to add route pickup point'),
          severity: 'error',
        });
      });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete route pickup points', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this route pickup point?')) {
      dispatch(deleteRoutePickupPoint(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Route pickup point deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page
        })
        .catch((err) => {
          setSnack({
            open: true,
            message: err.message || 'Failed to delete route pickup point',
            severity: 'error',
          });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting route pickup points as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing route pickup points', severity: 'info' });
  };

  const handleSettings = () => {
    setSnack({ open: true, message: 'Settings functionality not implemented', severity: 'warning' });
  };

  // Map IDs to names for display
  const getRouteName = (routeId) => transportRoutesList.find((route) => route._id === routeId)?.title || 'Unknown';
  const getPointName = (pointId) => pickupPointsList.find((point) => point._id === pointId)?.name || 'Unknown';

  // Pagination logic
  const filteredRoutes = routePickupPointsList.filter((route) =>
    route.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.pickups.some((pickup) => pickup.point.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredRoutes.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRoutes.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredRoutes.flatMap((route) =>
    route.pickups.map((pickup) => ({
      Route: route.route,
      'Pickup Point': pickup.point,
      'Monthly Fees ($)': pickup.fee.toFixed(2),
      'Distance (km)': pickup.distance,
      'Pickup Time': pickup.time,
    }))
  );

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
      <Heading variant="h4">Route Pickup Point Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RouteCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Route Pickup Point List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="route-pickup-points.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                    + Add New Route Pickup Point
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search routes or pickup points"
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
              {currentPageData.map((route, routeIndex) => (
                <Box key={routeIndex} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#1a2526', mb: 2, fontWeight: 600 }}>
                    {route.route}
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#34495e' }}>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                            Pickup Point
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                            Monthly Fees ($)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                            Distance (km)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                            Pickup Time
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : route.pickups.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                              No pickup points found
                            </TableCell>
                          </TableRow>
                        ) : (
                          route.pickups.map((pickup) => (
                            <StyledTableRow key={pickup._id}>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                                {pickup.point}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                                {pickup.fee.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                                {pickup.distance}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                                {pickup.time}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                                <IconButton
                                  onClick={() => handleEdit(pickup)}
                                  sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                                  title="Edit"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(pickup._id)}
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
                </Box>
              ))}
              <PaginationContainer>
                <Typography sx={{ color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredRoutes.length} routes
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
          </RouteCard>
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
          {editId ? 'Edit Route Pickup Point' : 'Add New Route Pickup Point'}
        </DialogTitle>
        <DialogContentStyled>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }} variant="outlined">
            <InputLabel>Route</InputLabel>
            <Select
              name="routeId"
              value={pickup.routeId}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, pointRef)}
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
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
            <InputLabel>Pickup Point</InputLabel>
            <Select
              name="pointId"
              value={pickup.pointId}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, feeRef)}
              label="Pickup Point"
              size="small"
              inputRef={pointRef}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {pickupPointsList.map((point) => (
                <MenuItem key={point._id} value={point._id}>{point.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Monthly Fee ($)"
            name="fee"
            type="number"
            value={pickup.fee}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, distanceRef)}
            variant="outlined"
            size="small"
            inputRef={feeRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ min: 0, step: '0.01' }}
            required
          />
          <TextField
            fullWidth
            label="Distance (km)"
            name="distance"
            type="number"
            value={pickup.distance}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, timeRef)}
            variant="outlined"
            size="small"
            inputRef={distanceRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ min: 0, step: '0.01' }}
            required
          />
          <TextField
            fullWidth
            label="Pickup Time (HH:MM or HH:MM AM/PM)"
            name="time"
            value={pickup.time}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
            variant="outlined"
            size="small"
            inputRef={timeRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            required
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

export default RoutePickupPoint;