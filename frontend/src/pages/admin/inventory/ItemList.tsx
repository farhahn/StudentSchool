import React, { useState } from 'react';

const ItemList = () => {
  const [items, setItems] = useState([
    { id: 1, item: 'Cricket Bat', description: '', category: 'Sports', unit: 'Piece', availableQuantity: 142 },
    { id: 2, item: 'Uniform', description: '', category: 'Staff Dress', unit: 'Piece', availableQuantity: -3 },
    { id: 3, item: 'Table chair', description: '', category: 'Furniture', unit: 'Piece', availableQuantity: 115 },
    { id: 4, item: 'Staff Uniform', description: '', category: 'Staff Dress', unit: 'Piece', availableQuantity: 49 },
    { id: 5, item: 'Benches', description: '', category: 'Furniture', unit: 'Piece', availableQuantity: 25 },
    { id: 6, item: 'Football', description: '', category: 'Sports', unit: 'Piece', availableQuantity: 34 },
    { id: 7, item: 'Class Board', description: '', category: 'Books Stationery', unit: 'Piece', availableQuantity: 15 },
    { id: 8, item: 'Desk', description: '', category: 'Furniture', unit: 'Piece', availableQuantity: -1 },
    { id: 9, item: 'Lab Equipment', description: '', category: 'Chemistry Lab Apparatus', unit: 'Piece', availableQuantity: 44 },
    { id: 10, item: 'Notebooks', description: '', category: 'Books Stationery', unit: 'Piece', availableQuantity: 122 },
    { id: 11, item: 'Projectors', description: '', category: 'Chemistry Lab Apparatus', unit: 'Piece', availableQuantity: 74 },
    { id: 12, item: 'Paper and Pencils', description: '', category: 'Books Stationery', unit: 'Piece', availableQuantity: 85 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    id: null,
    item: '',
    category: 'Select',
    unit: 'Select',
    description: '',
    availableQuantity: '',
  });

  const [categories] = useState(['Select', 'Sports', 'Staff Dress', 'Furniture', 'Books Stationery', 'Chemistry Lab Apparatus']);
  const [units] = useState(['Select', 'Piece', 'Set', 'Box']);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    if (newItem.item && newItem.category !== 'Select' && newItem.unit !== 'Select' && newItem.availableQuantity) {
      if (isEditing) {
        setItems(items.map(item =>
          item.id === newItem.id ? { ...newItem, availableQuantity: parseInt(newItem.availableQuantity) } : item
        ));
        setIsEditing(false);
      } else {
        setItems([...items, { ...newItem, id: Date.now(), availableQuantity: parseInt(newItem.availableQuantity) }]);
      }
      setNewItem({ id: null, item: '', category: 'Select', unit: 'Select', description: '', availableQuantity: '' });
    } else {
      alert('Please fill all required fields (*).');
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit });
      setIsEditing(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="item-container">
      <div className="item-header">
        <div className="add-form">
          <h2>Add Item</h2>
          <div className="form-group">
            <label>Item *</label>
            <input type="text" name="item" value={newItem.item} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Item Category *</label>
            <select name="category" value={newItem.category} onChange={handleInputChange} className="form-input">
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Unit *</label>
            <select name="unit" value={newItem.unit} onChange={handleInputChange} className="form-input">
              {units.map((unit, index) => (
                <option key={index} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" value={newItem.description} onChange={handleInputChange} className="form-input" />
          </div>
          <button className="save-btn" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
        <div className="item-list">
          <h2>Item List</h2>
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
          <table className="item-table">
            <thead>
              <tr>
                {['Item', 'Description', 'Item Category', 'Unit', 'Available Quantity', 'Action'].map(header => (
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
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{item.unit}</td>
                    <td>{item.availableQuantity}</td>
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
          <div className="pagination">Records: 1 to {items.length} of {items.length}</div>
        </div>
      </div>

      <style>{`
        .item-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px; /* Small font size */
          min-height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }

        .item-header {
          display: flex;
          gap: 20px;
        }

        h2 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .add-form, .item-list {
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

        .save-btn {
          padding: 10px 20px;
          background-color: #757575;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn:hover {
          background-color: #616161;
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

        .item-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
        }

        .item-table th, .item-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .item-table th {
          background-color: #757575;
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

        .pagination {
          text-align: right;
          margin-top: 10px;
          color: #555;
        }

        @media (max-width: 768px) {
          .item-header {
            flex-direction: column;
          }
          .item-table th, .item-table td {
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

export default ItemList;