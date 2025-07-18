import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  getAllStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  clearStockItemError,
} from '../../../redux/itemStockRelated/itemStockHandle';
import { getAllItems } from '../../../redux/itemRelated/itemHandle';
import { getAllCategoryCards } from '../../../redux/categoryRelated/categoryCardSlice';
import { getAllSupplier } from '../../../redux/supplierRelated/supplierHandle';

// Styled Components (unchanged)
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

const StockCard = styled(Card)`
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

// CSS Animations (unchanged)
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

const AddItemStock = () => {
  const dispatch = useDispatch();
  const stockItemState = useSelector((state) => state.stockItem || { stockItemsList: [], loading: false, error: null });
  const itemState = useSelector((state) => state.item || { itemsList: [], loading: false, error: null });
  const categoryState = useSelector((state) => state.categoryCard || { categoryCardsList: [], loading: false, error: null });
  const supplierState = useSelector((state) => state.supplier || { suppliersList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { stockItemsList, loading: stockLoading, error: stockError } = stockItemState;
  const { itemsList, loading: itemLoading, error: itemError } = itemState;
  const { categoryCardsList, loading: categoryLoading, error: categoryError } = categoryState;
  const { suppliersList, loading: supplierLoading, error: supplierError } = supplierState;
  const adminID = userState.currentUser?._id;

  // State for form, pagination, and snackbar
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    supplier: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: '',
    description: '',
  });
  const [itemSearch, setItemSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');

  // Refs for form fields
  const itemNameRef = useRef(null);
  const categoryRef = useRef(null);
  const supplierRef = useRef(null);
  const quantityRef = useRef(null);
  const purchasePriceRef = useRef(null);
  const purchaseDateRef = useRef(null);
  const descriptionRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Fetch data for dropdowns
  useEffect(() => {
    if (adminID) {
      dispatch(getAllItems(adminID));
      dispatch(getAllCategoryCards(adminID));
      dispatch(getAllSupplier(adminID));
      dispatch(getAllStockItems(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view stock items', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (stockError) {
      setSnack({ open: true, message: stockError, severity: 'error' });
      dispatch(clearStockItemError());
    } else if (itemError) {
      setSnack({ open: true, message: itemError, severity: 'error' });
      dispatch(clearItemError());
    } else if (categoryError) {
      setSnack({ open: true, message: categoryError, severity: 'error' });
      dispatch(clearCategoryCardError());
    } else if (supplierError) {
      setSnack({ open: true, message: supplierError, severity: 'error' });
      dispatch(clearSupplierError());
    }
  }, [stockError, itemError, categoryError, supplierError, dispatch]);

  // Focus on first field when dialog opens
  useEffect(() => {
    if (isPopupOpen && !editId) {
      setTimeout(() => itemNameRef.current?.focus(), 0);
    }
  }, [isPopupOpen, editId]);

  // Log data for debugging
  useEffect(() => {
    console.log('itemsList:', itemsList);
    console.log('categoryCardsList:', categoryCardsList);
    console.log('suppliersList:', suppliersList);
  }, [itemsList, categoryCardsList, suppliersList]);

  // Dynamic dropdown options with safeguards
  const itemOptions = (itemsList || [])
    .filter((item) => item && typeof item.item === 'string')
    .map((item) => item.item);
  const categoryOptions = (categoryCardsList || [])
    .filter((category) => category && typeof category.category === 'string')
    .map((category) => category.category);
  const supplierOptions = (suppliersList || [])
    .filter((supplier) => supplier && typeof (supplier.supplierName || supplier.name) === 'string')
    .map((supplier) => supplier.supplierName || supplier.name);

  // Filtered options with safeguards
  const filteredItems = useMemo(
    () =>
      itemOptions.filter((item) =>
        item ? item.toLowerCase().includes(itemSearch.toLowerCase()) : false
      ),
    [itemSearch, itemOptions]
  );
  const filteredCategories = useMemo(
    () =>
      categoryOptions.filter((category) =>
        category ? category.toLowerCase().includes(categorySearch.toLowerCase()) : false
      ),
    [categorySearch, categoryOptions]
  );
  const filteredSuppliers = useMemo(
    () =>
      supplierOptions.filter((supplier) =>
        supplier ? supplier.toLowerCase().includes(supplierSearch.toLowerCase()) : false
      ),
    [supplierSearch, supplierOptions]
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dropdown selections
  const handleSelect = (name, value) => {
    setNewItem((prev) => ({ ...prev, [name]: value }));
    if (name === 'itemName') setItemSearch('');
    if (name === 'category') setCategorySearch('');
    if (name === 'supplier') setSupplierSearch('');
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
    setNewItem({
      itemName: '',
      category: '',
      supplier: '',
      quantity: '',
      purchasePrice: '',
      purchaseDate: '',
      description: '',
    });
    setEditId(null);
    setIsPopupOpen(true);
    setItemSearch('');
    setCategorySearch('');
    setSupplierSearch('');
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setNewItem({
      itemName: '',
      category: '',
      supplier: '',
      quantity: '',
      purchasePrice: '',
      purchaseDate: '',
      description: '',
    });
    setItemSearch('');
    setCategorySearch('');
    setSupplierSearch('');
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add stock items', severity: 'error' });
      return;
    }
    if (!newItem.itemName || !newItem.category || !newItem.supplier || !newItem.quantity || !newItem.purchasePrice || !newItem.purchaseDate) {
      setSnack({ open: true, message: 'All required fields are mandatory', severity: 'warning' });
      return;
    }
    const quantity = parseFloat(newItem.quantity);
    const purchasePrice = parseFloat(newItem.purchasePrice);
    if (isNaN(quantity) || quantity < 0) {
      setSnack({ open: true, message: 'Quantity must be a non-negative number', severity: 'warning' });
      return;
    }
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      setSnack({ open: true, message: 'Purchase price must be a non-negative number', severity: 'warning' });
      return;
    }
    const action = editId
      ? updateStockItem({ id: editId, stockItem: newItem, adminID })
      : createStockItem(newItem, adminID);
    dispatch(action)
      .then(() => {
        setSnack({ open: true, message: editId ? 'Stock item updated successfully' : 'Stock item added successfully', severity: 'success' });
        handleClosePopup();
        setCurrentPage(0);
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save stock item', severity: 'error' });
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setNewItem({
      itemName: item.itemName,
      category: item.category,
      supplier: item.supplier,
      quantity: item.quantity.toString(),
      purchasePrice: item.purchasePrice.toString(),
      purchaseDate: item.purchaseDate.split('T')[0],
      description: item.description || '',
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete stock items', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      dispatch(deleteStockItem(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Stock item deleted successfully', severity: 'info' });
          setCurrentPage(0);
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete stock item', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting stock items as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing stock items', severity: 'info' });
  };

  // Pagination logic
  const filteredStockItems = stockItemsList.filter((item) =>
    item && item.itemName ? item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredStockItems.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredStockItems.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredStockItems.map((item) => ({
    ItemName: item.itemName || 'N/A',
    Category: item.category || 'N/A',
    Supplier: item.supplier || 'N/A',
    Quantity: item.quantity || 0,
    PurchasePrice: item.purchasePrice ? parseFloat(item.purchasePrice).toFixed(2) : '0.00',
    PurchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A',
    Description: item.description || 'N/A',
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
      <Heading variant="h4">Stock Item Management</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StockCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                <SubHeading variant="h5">Stock Item List</SubHeading>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink data={csvData} filename="stock-items.csv" style={{ textDecoration: 'none' }} onClick={handleExport}>
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
                    + Add New Stock Item
                  </AddButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search stock items"
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
                        Item Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Supplier
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Quantity
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Purchase Price
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Purchase Date
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          No stock items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((item) => (
                        <StyledTableRow key={item._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.itemName || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.category || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.supplier || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.quantity || 0}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            ${item.purchasePrice ? parseFloat(item.purchasePrice).toFixed(2) : '0.00'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {item.description || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEdit(item)}
                              sx={{ color: '#3498db', '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(item._id)}
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
                  Showing {currentPageData.length} of {filteredStockItems.length} records
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
          </StockCard>
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
          {editId ? 'Edit Stock Item' : 'Add New Stock Item'}
        </DialogTitle>
        <DialogContentStyled>
          <TextField
            fullWidth
            label="Item Name"
            value={itemSearch || newItem.itemName}
            onChange={(e) => setItemSearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, categoryRef)}
            variant="outlined"
            size="small"
            required
            inputRef={itemNameRef}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            select
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 200 },
                },
              },
            }}
            disabled={itemLoading}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItem key={item} value={item} onClick={() => handleSelect('itemName', item)}>
                  {item}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{itemLoading ? 'Loading...' : 'No items found'}</MenuItem>
            )}
          </TextField>
          <TextField
            fullWidth
            label="Category"
            value={categorySearch || newItem.category}
            onChange={(e) => setCategorySearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, supplierRef)}
            variant="outlined"
            size="small"
            required
            inputRef={categoryRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            select
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 200 },
                },
              },
            }}
            disabled={categoryLoading}
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <MenuItem key={category} value={category} onClick={() => handleSelect('category', category)}>
                  {category}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{categoryLoading ? 'Loading...' : 'No categories found'}</MenuItem>
            )}
          </TextField>
          <TextField
            fullWidth
            label="Supplier"
            value={supplierSearch || newItem.supplier}
            onChange={(e) => setSupplierSearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, quantityRef)}
            variant="outlined"
            size="small"
            required
            inputRef={supplierRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            select
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 200 },
                },
              },
            }}
            disabled={supplierLoading}
          >
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <MenuItem key={supplier} value={supplier} onClick={() => handleSelect('supplier', supplier)}>
                  {supplier}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{supplierLoading ? 'Loading...' : 'No suppliers found'}</MenuItem>
            )}
          </TextField>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={newItem.quantity}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, purchasePriceRef)}
            variant="outlined"
            size="small"
            required
            inputRef={quantityRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ step: 'any', min: 0 }}
          />
          <TextField
            fullWidth
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={newItem.purchasePrice}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, purchaseDateRef)}
            variant="outlined"
            size="small"
            required
            inputRef={purchasePriceRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            inputProps={{ step: 'any', min: 0 }}
          />
          <TextField
            fullWidth
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={newItem.purchaseDate}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
            variant="outlined"
            size="small"
            required
            inputRef={purchaseDateRef}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
            variant="outlined"
            size="small"
            multiline
            rows={3}
            inputRef={descriptionRef}
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

export default AddItemStock;