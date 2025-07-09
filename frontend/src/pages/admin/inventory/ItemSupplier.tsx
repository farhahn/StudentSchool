import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  clearSupplierError
} from '../../../redux/supplierRelated/supplierHandle';

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

const SupplierCard = styled(Card)`
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
    from { transform: scale(0.9

); opacity: 0; }
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

const ItemSupplier = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user || {});
  const { suppliersList, loading, error } = useSelector((state) => state.supplier || { suppliersList: [], loading: false, error: null });
  const adminID = currentUser?._id;

  // State for form, pagination, and snackbar
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Refs for form fields
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const contactPersonNameRef = useRef(null);
  const contactPersonPhoneRef = useRef(null);
  const contactPersonEmailRef = useRef(null);
  const descriptionRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch suppliers
  useEffect(() => {
    if (adminID) {
      dispatch(getAllSupplier(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view suppliers', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearSupplierError());
    }
  }, [error, dispatch]);

  // Focus on first field when dialog opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => nameRef.current?.focus(), 0);
    }
  }, [isPopupOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
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
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      description: ''
    });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      description: ''
    });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add suppliers', severity: 'error' });
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      setSnack({ open: true, message: 'Supplier Name and Phone are required!', severity: 'warning' });
      return;
    }
    const exists = suppliersList?.some(
      (supplier) =>
        (supplier.name.toLowerCase() === formData.name.trim().toLowerCase() ||
         supplier.phone.trim() === formData.phone.trim()) &&
        supplier._id !== editId
    );
    if (exists) {
      setSnack({ open: true, message: 'Supplier with same name or phone already exists!', severity: 'warning' });
      return;
    }
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || '',
      address: formData.address?.trim() || '',
      contactPersonName: formData.contactPersonName?.trim() || '',
      contactPersonPhone: formData.contactPersonPhone?.trim() || '',
      contactPersonEmail: formData.contactPersonEmail?.trim() || '',
      description: formData.description?.trim() || '',
      adminID: adminID || ''
    };
    const action = editId ? updateSupplier(editId, payload) : createSupplier(payload);
    dispatch(action)
      .then(() => {
        setSnack({ open: true, message: editId ? 'Supplier updated successfully' : 'Supplier created successfully', severity: 'success' });
        handleClosePopup();
        setCurrentPage(0);
        dispatch(getAllSupplier(adminID));
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save supplier', severity: 'error' });
      });
  };

  const handleEdit = (supplier) => {
    setEditId(supplier._id);
    setFormData({
      name: supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      contactPersonName: supplier.contactPersonName || '',
      contactPersonPhone: supplier.contactPersonPhone || '',
      contactPersonEmail: supplier.contactPersonEmail || '',
      description: supplier.description || ''
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete suppliers', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      dispatch(deleteSupplier(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Supplier deleted successfully', severity: 'info' });
          setCurrentPage(0);
          dispatch(getAllSupplier(adminID));
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete supplier', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting suppliers as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing suppliers', severity: 'info' });
  };

  // Pagination logic
  const filteredSuppliers = Array.isArray(suppliersList)
    ? suppliersList.filter(supplier =>
        (supplier.name && supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (supplier.phone && supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredSuppliers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredSuppliers.map((supplier) => ({
    Name: supplier.name,
    Phone: supplier.phone,
    Email: supplier.email,
    Address: supplier.address,
    ContactPersonName: supplier.contactPersonName,
    ContactPersonPhone: supplier.contactPersonPhone,
    ContactPersonEmail: supplier.contactPersonEmail,
    Description: supplier.description,
  }));

  if (!currentUser) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: '#7f8c8d' }}>Please log in to view suppliers.</Typography>;
  }

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
      <Heading variant="h4">Supplier Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SupplierCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Supplier List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="suppliers.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                    + Add New Supplier
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search suppliers"
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
                        Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Phone
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Address
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Contact Person
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Person Phone
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Person Email
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          No suppliers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((supplier) => (
                        <StyledTableRow key={supplier._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.phone}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.email}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.address}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.contactPersonName}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.contactPersonPhone}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.contactPersonEmail}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {supplier.description}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEdit(supplier)}
                              sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(supplier._id)}
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
                    Showing {currentPageData.length} of {filteredSuppliers.length} records
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
            </SupplierCard>
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
            {editId ? 'Edit Supplier' : 'Add New Supplier'}
          </DialogTitle>
          <DialogContentStyled>
            {[
              { name: 'name', label: 'Name', ref: nameRef, nextRef: phoneRef, required: true },
              { name: 'phone', label: 'Phone', ref: phoneRef, nextRef: emailRef, required: true },
              { name: 'email', label: 'Email', ref: emailRef, nextRef: addressRef },
              { personally: 'address', label: 'Address', ref: addressRef, nextRef: contactPersonNameRef },
              { name: 'contactPersonName', label: 'Contact Person Name', ref: contactPersonNameRef, nextRef: contactPersonPhoneRef },
              { name: 'contactPersonPhone', label: 'Contact Person Phone', ref: contactPersonPhoneRef, nextRef: contactPersonEmailRef },
              { name: 'contactPersonEmail', label: 'Contact Person Email', ref: contactPersonEmailRef, nextRef: descriptionRef },
              { name: 'description', label: 'Description', ref: descriptionRef, nextRef: saveButtonRef },
            ].map((field, index) => (
              <TextField
                key={index}
                fullWidth
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, field.nextRef)}
                variant="outlined"
                size="small"
                required={field.required}
                inputRef={field.ref}
                sx={{ mb: 2, mt: index === 0 ? 1 : 0, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
              />
            ))}
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

export default ItemSupplier;