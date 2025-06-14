import React, { useState } from 'react';

const AddItemStocks = () => {
  const [items, setItems] = useState([
    { id: 1, item: 'Projectors', category: 'Chemistry Lab Apparatus', supplier: 'Camlin Stationers', store: 'Chemistry Equipment (Ch201)', quantity: 15, purchasePrice: 180.00, purchaseDate: '04/30/2025' },
    { id: 2, item: 'Notebooks', category: 'Books Stationery', supplier: 'Camlin Stationers', store: 'Science Store (SC2)', quantity: 50, purchasePrice: 200.00, purchaseDate: '04/25/2025' },
    { id: 3, item: 'Staff Uniform', category: 'Staff Dress', supplier: 'Jhonson Uniform Dress', store: 'Uniform Dress Store (UND23)', quantity: 10, purchasePrice: 150.00, purchaseDate: '04/20/2025' },
    { id: 4, item: 'Equipment', category: 'Chemistry Lab Apparatus', supplier: 'Jhon smith Supplier', store: 'Chemistry Equipment (Ch201)', quantity: 20, purchasePrice: 150.00, purchaseDate: '04/15/2025' },
    { id: 5, item: 'Table chair', category: 'Furniture', supplier: 'David Furniture', store: 'Furniture Store (FS342)', quantity: 20, purchasePrice: 150.00, purchaseDate: '04/10/2025' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    item: '', category: '', supplier: '', store: '', quantity: '', purchasePrice: '', purchaseDate: '', document: '', description: '',
  });

  const [categories] = useState(['Select', 'Chemistry Lab Apparatus', 'Books Stationery', 'Staff Dress', 'Furniture', 'Sports']);
  const [suppliers] = useState(['Select', 'Camlin Stationers', 'Jhonson Uniform Dress', 'Jhon smith Supplier', 'David Furniture']);
  const [stores] = useState(['Select', 'Chemistry Equipment (Ch201)', 'Science Store (SC2)', 'Uniform Dress Store (UND23)', 'Furniture Store (FS342)', 'Sports Store (sp55)']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    if (
      newItem.item &&
      newItem.category !== 'Select' &&
      newItem.supplier !== 'Select' &&
      newItem.store !== 'Select' &&
      newItem.quantity &&
      newItem.purchasePrice &&
      newItem.purchaseDate
    ) {
      setItems([...items, { ...newItem, id: Date.now(), purchasePrice: parseFloat(newItem.purchasePrice) }]);
      setNewItem({ item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: '', description: '' });
    } else {
      alert('Please fill all required fields (*).');
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit, document: '', description: '' }); // Reset document and description for edit
      setItems(items.filter(item => item.id !== id)); // Remove old item to replace with edited one
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="stock-container">
      <div className="stock-header">
        <div className="add-form">
          <h2>Add Item Stock</h2>
          <div className="form-group">
            <label>Item Category *</label>
            <select name="category" value={newItem.category} onChange={handleInputChange} className="form-input">
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Item *</label>
            <select name="item" value={newItem.item} onChange={handleInputChange} className="form-input">
              <option value="">Select</option>
              {newItem.category && newItem.category !== 'Select' ? (
                ['Projectors', 'Notebooks', 'Staff Uniform', 'Equipment', 'Table chair', 'Cricket Bat', 'Class Board', 'Paper and Pencils'].map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              ) : null}
            </select>
          </div>
          <div className="form-group">
            <label>Supplier</label>
            <select name="supplier" value={newItem.supplier} onChange={handleInputChange} className="form-input">
              {suppliers.map((sup, index) => (
                <option key={index} value={sup}>{sup}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Store</label>
            <select name="store" value={newItem.store} onChange={handleInputChange} className="form-input">
              {stores.map((sto, index) => (
                <option key={index} value={sto}>{sto}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Purchase Price ($)*</label>
            <input type="number" step="0.01" name="purchasePrice" value={newItem.purchasePrice} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input type="date" name="purchaseDate" value={newItem.purchaseDate} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Attach Document</label>
            <input type="file" name="document" onChange={handleInputChange} className="form-input file-input" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={newItem.description} onChange={handleInputChange} className="form-input textarea" />
          </div>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
        <div className="stock-list">
          <h2>Item Stock List</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="icons">
              <span role="img" aria-label="export">📤</span>
              <span role="img" aria-label="print">🖨️</span>
              <span role="img" aria-label="close">❌</span>
            </div>
          </div>
          <table className="stock-table">
            <thead>
              <tr>
                {['Item', 'Category', 'Supplier', 'Store', 'Quantity', 'Purchase Date', 'Price ($)', 'Action'].map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items
                .filter(item =>
                  item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(item => (
                  <tr key={item.id} className="table-row">
                    <td>{item.item}</td>
                    <td>{item.category}</td>
                    <td>{item.supplier}</td>
                    <td>{item.store}</td>
                    <td>{item.quantity}</td>
                    <td>{item.purchaseDate}</td>
                    <td>{item.purchasePrice.toFixed(2)}</td>
                    <td>
                      <button className="action-btn edit-btn" onClick={() => handleEdit(item.id)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)}>
                        <span role="img" aria-label="delete">❌</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stock-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px; /* Small font size as per previous request */
          min-height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }

        .stock-header {
          display: flex;
          gap: 20px;
        }

        h2 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .add-form, .stock-list {
          background-color: #fff;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .file-input {
          padding: 8px 0;
        }

        .textarea {
          height: 60px;
          resize: vertical;
        }

        .save-btn {
          padding: 10px 20px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn:hover {
          background-color: #004d40;
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .search-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .icons span {
          font-size: 18px;
          margin-left: 10px;
          cursor: pointer;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
        }

        .stock-table th, .stock-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .stock-table th {
          background-color: #00796b;
          color: white;
        }

        .table-row:hover {
          background-color: #f0f0f0;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin-right: 8px;
          transition: transform 0.2s;
        }

        .edit-btn {
          color: #388e3c;
        }

        .delete-btn {
          color: #d32f2f;
        }

        .action-btn:hover {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .stock-header {
            flex-direction: column;
          }
          .stock-table th, .stock-table td {
            font-size: 12px;
            padding: 6px;
          }
          .form-input {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddItemStocks;