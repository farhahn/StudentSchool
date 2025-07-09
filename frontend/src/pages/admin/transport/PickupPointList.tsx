import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPickupPoints, createPickupPoint, updatePickupPoint, deletePickupPoint, clearPickupPointError } from '../../../redux/TransportRelated/PickupPointAction';
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

const PickupCard = styled(Card)`
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

const PickupPointList = () => {
  const dispatch = useDispatch();
  const pickupPointState = useSelector((state) => state.pickupPoint || { pickupPointsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { pickupPointsList, loading, error } = pickupPointState;
  const adminID = userState.currentUser?._id;

  // State for form, pagination, and snackbar
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [newPoint, setNewPoint] = useState({ name: '', lat: '', lng: '' });

  // Refs for form fields
  const nameRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch pickup points
  useEffect(() => {
    if (adminID) {
      dispatch(getAllPickupPoints(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view pickup points', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearPickupPointError());
    }
  }, [error, dispatch]);

  // Focus on first field when dialog opens
  useEffect(() => {
    if (isPopupOpen && !selectedPoint) {
      setTimeout(() => nameRef.current?.focus(), 0);
    }
  }, [isPopupOpen, selectedPoint]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPoint({ ...newPoint, [name]: value });
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
    setNewPoint({ name: '', lat: '', lng: '' });
    setEditId(null);
    setSelectedPoint(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPoint(null);
    setEditId(null);
    setNewPoint({ name: '', lat: '', lng: '' });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add pickup points', severity: 'error' });
      return;
    }
    if (!newPoint.name || !newPoint.lat || !newPoint.lng) {
      setSnack({ open: true, message: 'Name, latitude, and longitude are required', severity: 'warning' });
      return;
    }
    // Validate latitude and longitude
    const lat = parseFloat(newPoint.lat);
    const lng = parseFloat(newPoint.lng);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setSnack({ open: true, message: 'Latitude must be between -90 and 90', severity: 'warning' });
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setSnack({ open: true, message: 'Longitude must be between -180 and 180', severity: 'warning' });
      return;
    }
    const action = editId ? updatePickupPoint({ id: editId, pickupPoint: newPoint, adminID }) : createPickupPoint(newPoint, adminID);
    dispatch(action)
      .then(() => {
        setSnack({ open: true, message: editId ? 'Pickup point updated successfully' : 'Pickup point added successfully', severity: 'success' });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save pickup point', severity: 'error' });
      });
  };

  const handleEdit = (point) => {
    setEditId(point._id);
    setNewPoint({ name: point.name, lat: point.lat, lng: point.lng });
    setSelectedPoint(null);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete pickup points', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this pickup point?')) {
      dispatch(deletePickupPoint(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Pickup point deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete pickup point', severity: 'error' });
        });
    }
  };

  const handleMapView = (point) => {
    setSelectedPoint(point);
    setIsPopupOpen(true);
    setEditId(null);
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting pickup points as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing pickup points', severity: 'info' });
  };

  // Pagination logic
  const filteredPickupPoints = pickupPointsList.filter((point) =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredPickupPoints.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPickupPoints.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredPickupPoints.map((point) => ({
    Name: point.name,
    Latitude: point.lat,
    Longitude: point.lng,
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
      <Heading variant="h4">Pickup Point Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PickupCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Pickup Point List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="pickup-points.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                    + Add New Pickup Point
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search pickup points"
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
                        Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Latitude
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Longitude
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Action
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
                          No pickup points found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((point) => (
                        <StyledTableRow key={point._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {point.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {point.lat}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {point.lng}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleMapView(point)}
                              sx={{ color: '#7f8c8d', '&:hover': { backgroundColor: '#ecf0f1', color: '#3498db' } }}
                              title="View Map"
                            >
                              📍
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(point)}
                              sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(point._id)}
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
                  Showing {currentPageData.length} of {filteredPickupPoints.length} records
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
          </PickupCard>
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
        {selectedPoint ? (
          <>
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
              Map View
            </DialogTitle>
            <DialogContentStyled>
              <Box
                sx={{
                  height: { xs: '300px', md: '400px' },
                  bgcolor: '#ecf0f1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid #ddd',
                }}
              >
                <Typography color="textSecondary" textAlign="center">
                  Map for {selectedPoint.name}<br />
                  Latitude: {selectedPoint.lat}, Longitude: {selectedPoint.lng}<br />
                  (Integrate Google Maps API here with these coordinates)
                </Typography>
              </Box>
            </DialogContentStyled>
            <DialogActions sx={{ p: 2, justifyContent: 'center', background: '#f9fbfd', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <CancelButton onClick={handleClosePopup}>Close</CancelButton>
            </DialogActions>
          </>
        ) : (
          <>
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
              {editId ? 'Edit Pickup Point' : 'Add New Pickup Point'}
            </DialogTitle>
            <DialogContentStyled>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newPoint.name}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, latRef)}
                variant="outlined"
                size="small"
                required
                inputRef={nameRef}
                sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
              />
              <TextField
                fullWidth
                label="Latitude"
                name="lat"
                type="number"
                value={newPoint.lat}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, lngRef)}
                variant="outlined"
                size="small"
                required
                inputRef={latRef}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                inputProps={{ step: 'any' }}
              />
              <TextField
                fullWidth
                label="Longitude"
                name="lng"
                type="number"
                value={newPoint.lng}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
                variant="outlined"
                size="small"
                required
                inputRef={lngRef}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                inputProps={{ step: 'any' }}
              />
            </DialogContentStyled>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between', background: '#f9fbfd', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <CancelButton onClick={handleClosePopup}>Cancel</CancelButton>
              <SaveButton onClick={handleSave} ref={saveButtonRef}>
                {editId ? 'Update' : 'Save'}
              </SaveButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default PickupPointList;