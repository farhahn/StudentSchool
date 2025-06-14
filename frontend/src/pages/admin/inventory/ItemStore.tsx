import React, { useState } from 'react';

const ItemStore = () => {
  const [stores, setStores] = useState([
    { id: 1, storeName: 'Library Store', storeCode: 'LB2', description: '' },
    { id: 2, storeName: 'Science Store', storeCode: 'SC2', description: '' },
    { id: 3, storeName: 'Uniform Dress Store', storeCode: 'UND23', description: '' },
    { id: 4, storeName: 'Furniture Store', storeCode: 'FS342', description: '' },
    { id: 5, storeName: 'Chemistry Equipment', storeCode: 'Ch201', description: 'The basic idea about the proper and necessary chemistry lab apparatus should be cleared among the students.' },
    { id: 6, storeName: 'Sports Store', storeCode: 'sp55', description: '' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newStore, setNewStore] = useState({
    id: null,
    storeName: '',
    storeCode: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleSave = () => {
    if (newStore.storeName && newStore.storeCode) {
      if (isEditing) {
        setStores(stores.map(store =>
          store.id === newStore.id ? { ...newStore } : store
        ));
        setIsEditing(false);
      } else {
        setStores([...stores, { ...newStore, id: Date.now() }]);
      }
      setNewStore({ id: null, storeName: '', storeCode: '', description: '' });
    } else {
      alert('Please fill all required fields (*).');
    }
  };

  const handleEdit = (id) => {
    const storeToEdit = stores.find(store => store.id === id);
    if (storeToEdit) {
      setNewStore({ ...storeToEdit });
      setIsEditing(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete store with ID: ${id}?`)) {
      setStores(stores.filter(store => store.id !== id));
    }
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <div className="add-form">
          <h2 className="form-title">Add Item Store</h2>
          <div className="form-group">
            <label className="form-label">Item Store Name *</label>
            <input
              type="text"
              name="storeName"
              value={newStore.storeName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter store name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Item Store Code *</label>
            <input
              type="text"
              name="storeCode"
              value={newStore.storeCode}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter store code"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={newStore.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter description"
            />
          </div>
          <button className="save-btn" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
        <div className="store-list">
          <h2 className="list-title">Item Store List</h2>
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
          <table className="store-table">
            <thead>
              <tr>
                {['Item Store Name', 'Item Store Code', 'Description', 'Action'].map(header => (
                  <th key={header} className="table-header">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores
                .filter(store =>
                  store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  store.storeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  store.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(store => (
                  <tr key={store.id} className="table-row">
                    <td className="table-cell">{store.storeName}</td>
                    <td className="table-cell">{store.storeCode}</td>
                    <td className="table-cell">{store.description}</td>
                    <td className="table-cell action-cell">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(store.id)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(store.id)}>
                        <span role="img" aria-label="delete">❌</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">Records: 1 to {stores.length} of {stores.length}</div>
        </div>
      </div>

      <style>{`
        .store-container {
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px; /* Small font size */
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
          overflow-x: hidden;
          display: flex;
          justify-content: center;
        }

        .store-header {
          display: flex;
          gap: 2rem;
          max-width: 1200px;
          width: 100%;
          flex-wrap: wrap;
        }

        .form-title, .list-title {
          margin: 0 0 1.25rem 0;
          color: #2c3e50;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.0625rem;
        }

        .add-form, .store-list {
          background: white;
          padding: 1.5rem;
          border-radius: 0.9375rem;
          box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex: 1;
          min-width: 300px;
        }

        .add-form:hover, .store-list:hover {
          transform: translateY(-0.3125rem);
          box-shadow: 0 0.75rem 1.875rem rgba(0, 0, 0, 0.15);
        }

        .form-group {
          margin-bottom: 0.9375rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.3125rem;
          color: #34495e;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 2px solid #ecf0f1;
          border-radius: 0.5rem;
          font-size: 14px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          background: #ffffff;
        }

        .form-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0.3125rem rgba(52, 152, 219, 0.5);
          outline: none;
        }

        .form-input::placeholder {
          color: #bdc3c7;
        }

        .save-btn {
          padding: 0.75rem 1.5625rem;
          background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          transition: background 0.3s ease, transform 0.2s ease;
          width: 100%;
        }

        .save-btn:hover {
          background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
          transform: translateY(-0.125rem);
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          background: #fff;
          padding: 0.625rem;
          border-radius: 0.5rem;
          box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.05);
        }

        .search-input {
          padding: 0.625rem;
          border: 2px solid #ecf0f1;
          border-radius: 0.5rem;
          font-size: 14px;
          width: 70%;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          border-color: #3498db;
          outline: none;
        }

        .icons .icon {
          font-size: 1.25rem;
          margin-left: 0.625rem;
          color: #7f8c8d;
          transition: color 0.3s ease, transform 0.2s ease;
        }

        .icons .icon:hover {
          color: #3498db;
          transform: scale(1.2);
        }

        .store-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #ffffff;
          border-radius: 0.625rem;
          overflow: hidden;
          box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.05);
        }

        .table-header {
          background: linear-gradient(90deg, #34495e 0%, #2c3e50 100%);
          color: white;
          padding: 0.75rem;
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
          padding: 0.75rem;
          border-bottom: 1px solid #ecf0f1;
        }

        .action-cell {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.125rem;
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
          margin-top: 0.9375rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .store-header {
            gap: 1.5rem;
          }
          .add-form, .store-list {
            flex: 1 1 45%;
          }
        }

        @media (max-width: 768px) {
          .store-header {
            flex-direction: column;
            gap: 1rem;
          }
          .add-form, .store-list {
            flex: 1 1 100%;
            min-width: 0;
          }
          .store-table th, .store-table td {
            font-size: 12px;
            padding: 0.5rem;
          }
          .form-input {
            font-size: 12px;
          }
          .save-btn {
            width: 100%;
          }
          .search-input {
            width: 60%;
          }
        }

        @media (max-width: 480px) {
          .store-container {
            padding: 1rem;
          }
          .form-title, .list-title {
            font-size: 1.125rem;
          }
          .form-input {
            padding: 0.5rem 0.625rem;
          }
          .save-btn {
            padding: 0.625rem 1.25rem;
            font-size: 12px;
          }
          .search-bar {
            flex-direction: column;
            gap: 0.5rem;
          }
          .search-input {
            width: 100%;
          }
          .icons {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          .icons .icon {
            margin: 0 0.3125rem;
          }
          .table-header, .table-cell {
            padding: 0.375rem;
          }
          .pagination {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemStore;