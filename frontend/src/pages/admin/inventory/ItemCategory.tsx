import React, { useState } from 'react';

const ItemCategory = () => {
  const [categories, setCategories] = useState([
    { id: 1, category: 'Sports', description: '' },
    { id: 2, category: 'Staff Dress', description: '' },
    { id: 3, category: 'Furniture', description: '' },
    { id: 4, category: 'Books Stationery', description: 'Chemistry Lab Apparatus' },
    { id: 5, category: 'Chemistry Lab Apparatus', description: 'Chemistry Lab Apparatus' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState({
    id: null,
    category: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleSave = () => {
    if (newCategory.category) {
      if (isEditing) {
        setCategories(categories.map(cat =>
          cat.id === newCategory.id ? { ...newCategory } : cat
        ));
        setIsEditing(false);
      } else {
        setCategories([...categories, { ...newCategory, id: Date.now() }]);
      }
      setNewCategory({ id: null, category: '', description: '' });
    } else {
      alert('Please fill the required field (*).');
    }
  };

  const handleEdit = (id) => {
    const categoryToEdit = categories.find(cat => cat.id === id);
    if (categoryToEdit) {
      setNewCategory({ ...categoryToEdit });
      setIsEditing(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete category with ID: ${id}?`)) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <div className="add-form">
          <h2 className="form-title">Add Item Category</h2>
          <div className="form-group">
            <label className="form-label">Item Category *</label>
            <input
              type="text"
              name="category"
              value={newCategory.category}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter category name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter description"
            />
          </div>
          <button className="save-btn" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
        <div className="category-list">
          <h2 className="list-title">Item Category List</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="icons">
              <span role="img" aria-label="export" className="icon">📤</span>
              <span role="img" aria-label="print" className="icon">🖨️</span>
              <span role="img" aria-label="close" className="icon">❌</span>
            </div>
          </div>
          <table className="category-table">
            <thead>
              <tr>
                {['Item Category', 'Description', 'Action'].map(header => (
                  <th key={header} className="table-header">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories
                .filter(cat =>
                  cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  cat.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(cat => (
                  <tr key={cat.id} className="table-row">
                    <td className="table-cell">{cat.category}</td>
                    <td className="table-cell">{cat.description}</td>
                    <td className="table-cell action-cell">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(cat.id)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(cat.id)}>
                        <span role="img" aria-label="delete">❌</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">Records: 1 to {categories.length} of {categories.length}</div>
        </div>
      </div>

      <style>{`
        .category-container {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px; /* Small font size */
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
          overflow-x: hidden;
          display: flex;
          justify-content: center;
        }

        .category-header {
          display: flex;
          gap: 30px;
          max-width: 1200px;
          width: 100%;
        }

        .form-title, .list-title {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .add-form, .category-list {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .add-form:hover, .category-list:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          color: #34495e;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          background: #ffffff;
        }

        .form-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
          outline: none;
        }

        .form-input::placeholder {
          color: #bdc3c7;
        }

        .save-btn {
          padding: 12px 25px;
          background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .save-btn:hover {
          background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
          transform: translateY(-2px);
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          background: #fff;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .search-input {
          padding: 10px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 14px;
          width: 70%;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          border-color: #3498db;
          outline: none;
        }

        .icons .icon {
          font-size: 20px;
          margin-left: 10px;
          color: #7f8c8d;
          transition: color 0.3s ease, transform 0.2s ease;
        }

        .icons .icon:hover {
          color: #3498db;
          transform: scale(1.2);
        }

        .category-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .table-header {
          background: linear-gradient(90deg, #34495e 0%, #2c3e50 100%);
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .table-row {
          transition: background 0.3s ease;
        }

        .table-row:hover {
          background: #f9fbfd;
        }

        .table-cell {
          padding: 12px;
          border-bottom: 1px solid #ecf0f1;
        }

        .action-cell {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .edit-btn {
          color: #3498db;
        }

        .delete-btn {
          color: #e74c3c;
        }

        .action-btn:hover {
          transform: scale(1.3);
        }

        .pagination {
          text-align: right;
          margin-top: 15px;
          color: #7f8c8d;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .category-header {
            flex-direction: column;
          }
          .category-table th, .category-table td {
            font-size: 12px;
            padding: 8px;
          }
          .form-input {
            font-size: 12px;
          }
          .save-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemCategory;