import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Modal, InputLabel, FormControl,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import {
  getAllIssueItems, createIssueItem, updateIssueItem, deleteIssueItem, clearIssueItemError,
} from '../../../redux/IssueItemStock/IssueItemAction';
import { getAllCategoryCards, clearCategoryCardError } from '../../../redux/categoryRelated/categoryCardSlice';

const IssueItemList = () => {
  const dispatch = useDispatch();
  const { issueItemsList, loading: issueLoading, error: issueError } = useSelector((state) => state.issueItem || {});
  const { categoryCardsList, loading: categoryLoading, error: categoryError } = useSelector((state) => state.categoryCard || {});
  const adminID = useSelector((state) => state.user?.currentUser?._id);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: '', status: 'Issued',
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const people = ['Select', 'Maria Ford (9005)', 'Jason Charlton (9006)', 'Brandon Heart (9006)', 'William Abbot (9003)', 'James Deckard (9004)'];
  const categories = categoryCardsList.length > 0 ? [...categoryCardsList.map((card) => card.categoryCard)] : [];

  useEffect(() => {
    if (adminID) {
      console.log('Fetching issue items and categories for adminID:', adminID);
      dispatch(getAllIssueItems(adminID));
      dispatch(getAllCategoryCards(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view issue items and categories', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (issueError) {
      console.error('Issue item error:', issueError);
      setSnack({ open: true, message: issueError, severity: 'error' });
      dispatch(clearIssueItemError());
    }
    if (categoryError) {
      console.error('Category error:', categoryError);
      setSnack({ open: true, message: categoryError, severity: 'error' });
      dispatch(clearCategoryCardError());
    }
  }, [issueError, categoryError, dispatch]);

  useEffect(() => {
    console.log('Available categories:', categories);
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!newItem.item) return 'Item name is required';
    if (!newItem.category || !categories.includes(newItem.category)) return 'Please select a valid category';
    if (!newItem.issueDate) return 'Issue date is required';
    if (!newItem.issueTo || newItem.issueTo === 'Select') return 'Please select a valid issue recipient';
    if (!newItem.issuedBy || newItem.issuedBy === 'Select') return 'Please select a valid issuer';
    if (!newItem.quantity || parseInt(newItem.quantity) <= 0) return 'Quantity must be a positive number';
    return null;
  };

  const handleIssueItem = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add issue items', severity: 'error' });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setSnack({ open: true, message: validationError, severity: 'warning' });
      return;
    }

    const payload = {
      item: newItem.item,
      category: newItem.category,
      issueDate: newItem.issueDate,
      issueTo: newItem.issueTo,
      issuedBy: newItem.issuedBy,
      quantity: parseInt(newItem.quantity),
      status: newItem.status,
      adminID,
    };

    console.log('Submitting issue item:', payload);
    dispatch(createIssueItem(payload))
      .then((response) => {
        console.log('Issue item created:', response);
        setSnack({ open: true, message: 'Issue item added successfully', severity: 'success' });
        setNewItem({
          item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: '', status: 'Issued',
        });
        setOpenModal(false);
      })
      .catch((err) => {
        console.error('Error adding issue item:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add issue item';
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      });
  };

  const handleReturnItem = (item) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update issue items', severity: 'error' });
      return;
    }
    dispatch(updateIssueItem({ id: item._id, issueItem: { ...item, status: 'Returned', adminID } }))
      .then(() => {
        setSnack({ open: true, message: 'Item marked as returned', severity: 'success' });
      })
      .catch((err) => {
        console.error('Error updating issue item:', err);
        setSnack({ open: true, message: err.message || 'Failed to update issue item', severity: 'error' });
      });
  };

  const handleDeleteItem = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete issue items', severity: 'error' });
      return;
    }
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      dispatch(deleteIssueItem(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Issue item deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          console.error('Error deleting issue item:', err);
          setSnack({ open: true, message: err.message || 'Failed to delete issue item', severity: 'error' });
        });
    }
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing issue items', severity: 'info' });
  };

  const filteredItems = Array.isArray(issueItemsList) ? issueItemsList.filter(
    (item) =>
      item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const csvData = filteredItems.map((item) => ({
    Item: item.item,
    Category: item.category,
    IssueDate: new Date(item.issueDate).toLocaleDateString(),
    IssueTo: item.issueTo,
    IssuedBy: item.issuedBy,
    Quantity: item.quantity,
    Status: item.status,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Issue Item List
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenModal(true)}
          sx={{ fontSize: { xs: 12, md: 14 }, px: 3 }}
          disabled={categoryLoading || !categories.length}
        >
          Issue Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
        <TextField
          label="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', sm: '300px' } }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <CSVLink
            data={csvData}
            filename="issue-items.csv"
            style={{ textDecoration: 'none' }}
            onClick={() => setSnack({ open: true, message: 'Exporting issue items as CSV', severity: 'info' })}
          >
            <IconButton sx={{ color: '#666' }} title="Export">
              <DownloadIcon />
            </IconButton>
          </CSVLink>
          <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a2526' }}>
              {['Item', 'Note', 'Category', 'Issue Date', 'Issue To', 'Issued By', 'Quantity', 'Status', 'Action'].map((header) => (
                <TableCell key={header} sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {issueLoading || categoryLoading ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{item.item}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>-</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{item.category}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{item.issueTo}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{item.issuedBy}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>{item.quantity}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        color: item.status === 'Returned' ? '#388e3c' : '#d32f2f',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', md: '0.875rem' },
                      }}
                    >
                      {item.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.status === 'Issued' && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReturnItem(item)}
                        sx={{ mr: 1, fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                      >
                        Return
                      </Button>
                    )}
                    <IconButton onClick={() => handleDeleteItem(item._id)} disabled={issueLoading}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: 1,
            width: { xs: '90%', sm: 400 },
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Issue New Item
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category *</InputLabel>
            <Select
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              disabled={categoryLoading || !categories.length}
            >
              {categories.length === 0 ? (
                <MenuItem value="" disabled>No categories available</MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Item *"
            name="item"
            value={newItem.item}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Issue Date *"
            name="issueDate"
            type="date"
            value={newItem.issueDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Issue To *</InputLabel>
            <Select name="issueTo" value={newItem.issueTo} onChange={handleInputChange}>
              {people.map((person) => (
                <MenuItem key={person} value={person}>{person}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Issued By *</InputLabel>
            <Select name="issuedBy" value={newItem.issuedBy} onChange={handleInputChange}>
              {people.map((person) => (
                <MenuItem key={person} value={person}>{person}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Quantity *"
            name="quantity"
            type="number"
            value={newItem.quantity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleIssueItem}
              disabled={issueLoading || categoryLoading || !categories.length}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IssueItemList;