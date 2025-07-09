// import React, { useState, useEffect } from 'react';
// import {
//   Box, Typography, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, IconButton, Snackbar, Alert, InputLabel, FormControl, InputAdornment,
//   CircularProgress,
// } from '@mui/material';
// import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
// import { useDispatch, useSelector } from 'react-redux';
// import { CSVLink } from 'react-csv';
// import {
//   getAllStockItems, createStockItem, updateStockItem, deleteStockItem, clearStockItemError,
// } from '../../../redux/itemStockRelated/itemStockHandle';
// import {
//   getAllCategoryCards,
//   clearCategoryCardErrorAction,
// } from '../../../redux/categoryRelated/categoryCard';
// import {
//   getAllItems,
//   createItem,
//   updateItem,
//   deleteItem,
//   clearItemError,
// } from '../../../redux/itemRelated/itemHandle';
// import {
//   getAllSupplier,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   clearSupplierError,
// } from '../../../redux/supplierRelated/supplierHandle';
// import {
//   getAllStores,
//   createStore,
//   updateStore,
//   deleteStore,
//   clearStoreError,
// } from '../../../redux/storeItemRelated/storeHandle';

// const AddItemStocks = () => {
//   const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user || {});
//   const { stockItemsList, loading: stockLoading, error: stockError } = useSelector((state) => state.stockItem || {});
//   const { categoryCardsList, loading: categoryLoading, error: categoryError } = useSelector((state) => state.categoryCard || {});
//   const { itemsList, loading: itemLoading, error: itemError } = useSelector((state) => state.item || {});
//   const { suppliersList, loading: supplierLoading, error: supplierError } = useSelector((state) => state.supplier || {});
//   const { storesList, loading: storeLoading, error: storeError } = useSelector((state) => state.store || {});
//   const adminID = currentUser?._id;
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newItem, setNewItem] = useState({
//     item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
//   });
//   const [editId, setEditId] = useState(null);
//   const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

//   useEffect(() => {
//     console.log('Admin ID:', adminID);
//     console.log('Current User:', currentUser);
//     if (adminID) {
//       dispatch(getAllStockItems(adminID));
//       dispatch(getAllCategoryCards(adminID));
//       dispatch(getAllItems(adminID));
//       dispatch(getAllSupplier(adminID));
//       dispatch(getAllStores(adminID));
//     } else {
//       setSnack({ open: true, message: 'Please log in to view stock items', severity: 'error' });
//     }
//   }, [dispatch, adminID, currentUser]);

//   useEffect(() => {
//     console.log('Category Cards List:', JSON.stringify(categoryCardsList, null, 2));
//     console.log('Category Loading:', categoryLoading, 'Category Error:', categoryError);
//     console.log('Stores List:', JSON.stringify(storesList, null, 2));
//     console.log('Store Loading:', storeLoading, 'Store Error:', storeError);
//     if (stockError) {
//       setSnack({ open: true, message: stockError, severity: 'error' });
//       dispatch(clearStockItemError());
//     }
//     if (categoryError) {
//       setSnack({ open: true, message: categoryError, severity: 'error' });
//       dispatch(clearCategoryCardErrorAction());
//     }
//     if (itemError) {
//       setSnack({ open: true, message: itemError, severity: 'error' });
//       dispatch(clearItemError());
//     }
//     if (supplierError) {
//       setSnack({ open: true, message: supplierError, severity: 'error' });
//       dispatch(clearSupplierError());
//     }
//     if (storeError) {
//       setSnack({ open: true, message: storeError, severity: 'error' });
//       dispatch(clearStoreError());
//     }
//   }, [stockError, categoryError, itemError, supplierError, storeError, categoryCardsList, categoryLoading, storesList, storeLoading, dispatch]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewItem((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setNewItem((prev) => ({ ...prev, document: e.target.files[0] }));
//   };

//   const handleSave = () => {
//     if (!adminID) {
//       setSnack({ open: true, message: 'Please log in to add stock items', severity: 'error' });
//       return;
//     }
//     if (
//       !newItem.item || newItem.category === 'Select' || newItem.supplier === 'Select' ||
//       newItem.store === 'Select' || !newItem.quantity || !newItem.purchasePrice || !newItem.purchaseDate
//     ) {
//       setSnack({ open: true, message: 'Please fill all required fields', severity: 'warning' });
//       return;
//     }

//     const payload = {
//       item: newItem.item,
//       category: newItem.category,
//       supplier: newItem.supplier,
//       store: newItem.store,
//       quantity: parseInt(newItem.quantity),
//       purchasePrice: parseFloat(newItem.purchasePrice),
//       purchaseDate: newItem.purchaseDate,
//       document: newItem.document,
//       description: newItem.description,
//       adminID,
//     };

//     if (editId) {
//       dispatch(updateStockItem({ id: editId, stockItem: payload, adminID }))
//         .then(() => {
//           setSnack({ open: true, message: 'Stock item updated successfully', severity: 'success' });
//           setEditId(null);
//           setNewItem({
//             item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
//           });
//         })
//         .catch((err) => {
//           setSnack({ open: true, message: err.response?.data?.message || err.message || 'Failed to update stock item', severity: 'error' });
//         });
//     } else {
//       dispatch(createStockItem(payload, adminID))
//         .then(() => {
//           setSnack({ open: true, message: 'Stock item added successfully', severity: 'success' });
//           setNewItem({
//             item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
//           });
//         })
//         .catch((err) => {
//           setSnack({ open: true, message: err.response?.data?.message || err.message || 'Failed to add stock item', severity: 'error' });
//         });
//     }
//   };

//   const handleEdit = (item) => {
//     setEditId(item._id);
//     setNewItem({
//       item: item.item,
//       category: item.category,
//       supplier: item.supplier,
//       store: item.store,
//       quantity: item.quantity.toString(),
//       purchasePrice: item.purchasePrice.toString(),
//       purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
//       document: null,
//       description: item.description,
//     });
//   };

//   const handleDelete = (id) => {
//     if (!adminID) {
//       setSnack({ open: true, message: 'Please log in to delete stock items', severity: 'error' });
//       return;
//     }
//     if (window.confirm(`Are you sure you want to delete stock item with ID: ${id}?`)) {
//       dispatch(deleteStockItem(id, adminID))
//         .then(() => {
//           setSnack({ open: true, message: 'Stock item deleted successfully', severity: 'info' });
//         })
//         .catch((err) => {
//           setSnack({ open: true, message: err.response?.data?.message || err.message || 'Failed to delete stock item', severity: 'error' });
//         });
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//     setSnack({ open: true, message: 'Printing stock items', severity: 'info' });
//   };

//   const filteredItems = stockItemsList.filter(
//     (item) =>
//       item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const csvData = filteredItems.map((item) => ({
//     Item: item.item,
//     Category: item.category,
//     Supplier: item.supplier,
//     Store: item.store,
//     Quantity: item.quantity,
//     PurchasePrice: item.purchasePrice,
//     PurchaseDate: new Date(item.purchaseDate).toLocaleDateString(),
//     Description: item.description,
//   }));

//   const filteredItemsByCategory = newItem.category === 'Select'
//     ? []
//     : itemsList.filter((item) => item.category === newItem.category);

//   return (
//     <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//       <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
//         Add Item Stock
//       </Typography>
//       <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
//         <Box sx={{ flex: 1, bgcolor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Add/Edit Stock Item
//           </Typography>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="category-label">Category *</InputLabel>
//             <Select
//               labelId="category-label"
//               id="category"
//               name="category"
//               value={newItem.category}
//               onChange={handleInputChange}
//               disabled={categoryLoading}
//             >
//               <MenuItem value="Select">Select</MenuItem>
//               {categoryCardsList.length === 0 && !categoryLoading ? (
//                 <MenuItem value="" disabled>
//                   No categories available
//                 </MenuItem>
//               ) : (
//                 categoryCardsList.map((cat) => (
//                   cat.name ? (
//                     <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
//                   ) : (
//                     console.log('Invalid category object:', cat) || null
//                   )
//                 )).filter(Boolean)
//               )}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="item-label">Item *</InputLabel>
//             <Select
//               labelId="item-label"
//               id="item"
//               name="item"
//               value={newItem.item}
//               onChange={handleInputChange}
//               disabled={newItem.category === 'Select' || categoryLoading || itemLoading}
//             >
//               <MenuItem value="">Select</MenuItem>
//               {filteredItemsByCategory.length === 0 && newItem.category !== 'Select' ? (
//                 <MenuItem value="" disabled>
//                   No items available for selected category
//                 </MenuItem>
//               ) : (
//                 filteredItemsByCategory.map((item) => (
//                   item.name ? (
//                     <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
//                   ) : (
//                     console.log('Invalid item object:', item) || null
//                   )
//                 )).filter(Boolean)
//               )}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="supplier-label">Supplier *</InputLabel>
//             <Select
//               labelId="supplier-label"
//               id="supplier"
//               name="supplier"
//               value={newItem.supplier}
//               onChange={handleInputChange}
//               disabled={supplierLoading}
//             >
//               <MenuItem value="Select">Select</MenuItem>
//               {suppliersList.length === 0 && !supplierLoading ? (
//                 <MenuItem value="" disabled>
//                   No suppliers available
//                 </MenuItem>
//               ) : (
//                 suppliersList.map((sup) => (
//                   sup.name ? (
//                     <MenuItem key={sup._id} value={sup.name}>{sup.name}</MenuItem>
//                   ) : (
//                     console.log('Invalid supplier object:', sup) || null
//                   )
//                 )).filter(Boolean)
//               )}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="store-label">Store *</InputLabel>
//             <Select
//               labelId="store-label"
//               id="store"
//               name="store"
//               value={newItem.store}
//               onChange={handleInputChange}
//               disabled={storeLoading}
//             >
//               <MenuItem value="Select">Select</MenuItem>
//               {storesList.length === 0 && !storeLoading ? (
//                 <MenuItem value="" disabled>
//                   No stores available
//                 </MenuItem>
//               ) : (
//                 storesList.map((sto) => (
//                   sto.storeName ? (
//                     <MenuItem key={sto._id} value={sto.storeName}>{sto.storeName}</MenuItem>
//                   ) : (
//                     console.log('Invalid store object:', sto) || null
//                   )
//                 )).filter(Boolean)
//               )}
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             id="quantity"
//             label="Quantity *"
//             name="quantity"
//             type="number"
//             value={newItem.quantity}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             fullWidth
//             id="purchasePrice"
//             label="Purchase Price ($)*"
//             name="purchasePrice"
//             type="number"
//             step="0.01"
//             value={newItem.purchasePrice}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             fullWidth
//             id="purchaseDate"
//             label="Purchase Date *"
//             name="purchaseDate"
//             type="date"
//             value={newItem.purchaseDate}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             fullWidth
//             id="document"
//             label="Attach Document"
//             name="document"
//             type="file"
//             onChange={handleFileChange}
//             sx={{ mb: 2 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             fullWidth
//             id="description"
//             label="Description"
//             name="description"
//             multiline
//             rows={3}
//             value={newItem.description}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleSave}
//             disabled={stockLoading || categoryLoading || itemLoading || supplierLoading || storeLoading}
//             sx={{ mt: 1 }}
//           >
//             {editId ? 'Update' : 'Save'}
//           </Button>
//         </Box>
//         <Box sx={{ flex: 2, bgcolor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Item Stock List
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <CSVLink
//                 data={csvData}
//                 filename="stock-items.csv"
//                 style={{ textDecoration: 'none' }}
//                 onClick={() => setSnack({ open: true, message: 'Exporting stock items as CSV', severity: 'info' })}
//               >
//                 <IconButton sx={{ color: '#666' }} title="Export">
//                   <DownloadIcon />
//                 </IconButton>
//               </CSVLink>
//               <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
//                 <PrintIcon />
//               </IconButton>
//             </Box>
//           </Box>
//           <TextField
//             fullWidth
//             id="search-items"
//             label="Search items"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: '#1a2526' }}>
//                   {['Item', 'Category', 'Supplier', 'Store', 'Quantity', 'Purchase Date', 'Price ($)', 'Action'].map((header) => (
//                     <TableCell key={header} sx={{ color: '#fff', fontWeight: 600 }}>
//                       {header}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stockLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} sx={{ textAlign: 'center', p: 2 }}>
//                       <CircularProgress size={24} />
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         Loading stock items...
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : filteredItems.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} sx={{ textAlign: 'center', p: 2 }}>
//                       No stock items found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredItems.map((item) => (
//                     <TableRow key={item._id}>
//                       <TableCell>{item.item}</TableCell>
//                       <TableCell>{item.category}</TableCell>
//                       <TableCell>{item.supplier}</TableCell>
//                       <TableCell>{item.store}</TableCell>
//                       <TableCell>{item.quantity}</TableCell>
//                       <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
//                       <TableCell>{item.purchasePrice.toFixed(2)}</TableCell>
//                       <TableCell>
//                         <IconButton onClick={() => handleEdit(item)} disabled={stockLoading}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(item._id)} disabled={stockLoading}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Typography sx={{ mt: 2 }}>
//             Records: {filteredItems.length} of {stockItemsList.length}
//           </Typography>
//         </Box>
//       </Box>
//       <Snackbar
//         open={snack.open}
//         autoHideDuration={3000}
//         onClose={() => setSnack({ ...snack, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
//           {snack.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AddItemStocks;