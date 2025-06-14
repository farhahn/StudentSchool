import React, { useState } from 'react';

const ItemSupplier = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Camlin Stationers', phone: '84543436583', email: 'camlin@gmail.com', address: '22 Cristal Way, CA', contactPersonName: 'Bruce Stark', contactPersonPhone: '847487932', contactPersonEmail: 'bruce@gmail.com', description: '' },
    { id: 2, name: 'Jhonson Uniform Dress', phone: '8796787856', email: 'Jhonson@gmail.com', address: '22 Cristal Way, CA', contactPersonName: 'David', contactPersonPhone: '8766785678', contactPersonEmail: 'david@gmail.com', description: '' },
    { id: 3, name: 'David Furniture', phone: '57867678', email: 'david@gmail.com', address: '22 Cristal Way, CA', contactPersonName: 'Peter', contactPersonPhone: '685676578', contactPersonEmail: 'per@gmail.com', description: '' },
    { id: 4, name: 'Jhon smith Supplier', phone: '890809978', email: 'jhon@gmail.com', address: 'Delhi Road,DR', contactPersonName: 'David', contactPersonPhone: '8987978678', contactPersonEmail: 'david@gmail.com', description: '' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    id: null,
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleSave = () => {
    if (newSupplier.name) {
      if (isEditing) {
        setSuppliers(suppliers.map(supplier =>
          supplier.id === newSupplier.id ? { ...newSupplier } : supplier
        ));
        setIsEditing(false);
      } else {
        setSuppliers([...suppliers, { ...newSupplier, id: Date.now() }]);
      }
      setNewSupplier({
        id: null,
        name: '',
        phone: '',
        email: '',
        address: '',
        contactPersonName: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        description: '',
      });
    } else {
      alert('Please fill the required field (*).');
    }
  };

  const handleEdit = (id) => {
    const supplierToEdit = suppliers.find(supplier => supplier.id === id);
    if (supplierToEdit) {
      setNewSupplier({ ...supplierToEdit });
      setIsEditing(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete supplier with ID: ${id}?`)) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    }
  };

  return (
    <div className="supplier-container">
      <div className="supplier-header">
        <div className="add-form">
          <h2 className="form-title">Add Item Supplier</h2>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter supplier name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={newSupplier.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter phone number"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={newSupplier.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={newSupplier.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter address"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person Name</label>
            <input
              type="text"
              name="contactPersonName"
              value={newSupplier.contactPersonName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter contact person name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person Phone</label>
            <input
              type="text"
              name="contactPersonPhone"
              value={newSupplier.contactPersonPhone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter contact person phone"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person Email</label>
            <input
              type="email"
              name="contactPersonEmail"
              value={newSupplier.contactPersonEmail}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter contact person email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={newSupplier.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter description"
            />
          </div>
          <button className="save-btn" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
        <div className="supplier-list">
          <h2 className="list-title">Item Supplier List</h2>
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
          <table className="supplier-table">
            <thead>
              <tr>
                {['Item Supplier', 'Contact Person', 'Address', 'Action'].map(header => (
                  <th key={header} className="table-header">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers
                .filter(supplier =>
                  supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  supplier.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(supplier => (
                  <tr key={supplier.id} className="table-row">
                    <td className="table-cell">{supplier.name}</td>
                    <td className="table-cell">
                      <span role="img" aria-label="person">👤</span> {supplier.contactPersonName}
                    </td>
                    <td className="table-cell">
                      <span role="img" aria-label="address">📍</span> {supplier.address}
                    </td>
                    <td className="table-cell action-cell">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(supplier.id)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(supplier.id)}>
                        <span role="img" aria-label="delete">❌</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">Records: 1 to {suppliers.length} of {suppliers.length}</div>
        </div>
      </div>

      <style>{`
        .supplier-container {
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

        .supplier-header {
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

        .add-form, .supplier-list {
          background: white;
          padding: 1.5rem;
          border-radius: 0.9375rem;
          box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex: 1;
          min-width: 300px;
        }

        .add-form:hover, .supplier-list:hover {
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

        .supplier-table {
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
          .supplier-header {
            gap: 1.5rem;
          }
          .add-form, .supplier-list {
            flex: 1 1 45%;
          }
        }

        @media (max-width: 768px) {
          .supplier-header {
            flex-direction: column;
            gap: 1rem;
          }
          .add-form, .supplier-list {
            flex: 1 1 100%;
            min-width: 0;
          }
          .supplier-table th, .supplier-table td {
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
          .supplier-container {
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

export default ItemSupplier;