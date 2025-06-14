import React, { useState } from 'react';

const IssueItemList = () => {
  const [items, setItems] = useState([
    { id: 1, item: 'Staff Uniform', category: 'Staff Dress', issueDate: '04/25/2025', issueTo: 'Maria Ford (9005)', issuedBy: 'Brandon Heart (9006)', quantity: 5, status: 'Issued' },
    { id: 2, item: 'Projectors', category: 'Chemistry Lab Apparatus', issueDate: '04/22/2025', issueTo: 'Jason Charlton (9006)', issuedBy: 'William Abbot (9003)', quantity: 2, status: 'Issued' },
    { id: 3, item: 'Paper and Pencils', category: 'Books Stationery', issueDate: '04/15/2025', issueTo: 'Brandon Heart (9006)', issuedBy: 'James Deckard (9004)', quantity: 5, status: 'Issued' },
    { id: 4, item: 'Football', category: 'Sports', issueDate: '04/10/2025', issueTo: 'James Deckard (9004)', issuedBy: 'Maria Ford (9005)', quantity: 2, status: 'Returned' },
    { id: 5, item: 'Notebooks', category: 'Books Stationery', issueDate: '04/05/2025', issueTo: 'Jason Charlton (9006)', issuedBy: 'Brandon Heart (9006)', quantity: 5, status: 'Issued' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: '', status: 'Issued',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleIssueItem = () => {
    if (
      newItem.item &&
      newItem.category &&
      newItem.issueDate &&
      newItem.issueTo &&
      newItem.issuedBy &&
      newItem.quantity
    ) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: '', status: 'Issued' });
      setShowPopup(false);
    } else {
      alert('Please fill all fields.');
    }
  };

  const handleReturnItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: 'Returned' } : item
    ));
  };

  const handleDeleteItem = (id) => {
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="issue-container">
      <div className="header">
        <h2>Issue Item List</h2>
        <button className="issue-btn" onClick={() => setShowPopup(true)}>Issue Item</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select className="status-filter">
          <option value="100">100</option>
        </select>
        <div className="icons">
          <span role="img" aria-label="export">📤</span>
          <span role="img" aria-label="print">🖨️</span>
          <span role="img" aria-label="close">❌</span>
        </div>
      </div>

      <table className="issue-table">
        <thead>
          <tr>
            {['Item', 'Note', 'Item Category', 'Issue - Return', 'Issue To', 'Issued By', 'Quantity', 'Status', 'Action'].map(header => (
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
                <td>-</td>
                <td>{item.category}</td>
                <td>{item.issueDate}</td>
                <td>{item.issueTo}</td>
                <td>{item.issuedBy}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={item.status === 'Returned' ? 'status-returned' : 'status-issued'}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status === 'Issued' && (
                    <button className="action-btn return-btn" onClick={() => handleReturnItem(item.id)}>
                      Click to Return
                    </button>
                  )}
                  <button className="action-btn delete-btn" onClick={() => handleDeleteItem(item.id)}>
                    <span role="img" aria-label="delete">❌</span>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Issue New Item</h3>
            <div className="popup-form">
              <input
                type="text"
                name="item"
                placeholder="Item"
                value={newItem.item}
                onChange={handleInputChange}
                className="popup-input"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newItem.category}
                onChange={handleInputChange}
                className="popup-input"
              />
              <input
                type="date"
                name="issueDate"
                value={newItem.issueDate}
                onChange={handleInputChange}
                className="popup-input"
              />
              <input
                type="text"
                name="issueTo"
                placeholder="Issue To"
                value={newItem.issueTo}
                onChange={handleInputChange}
                className="popup-input"
              />
              <input
                type="text"
                name="issuedBy"
                placeholder="Issued By"
                value={newItem.issuedBy}
                onChange={handleInputChange}
                className="popup-input"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                className="popup-input"
              />
              <div className="popup-actions">
                <button className="save-btn" onClick={handleIssueItem}>Save</button>
                <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .issue-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px; /* Small font size */
          min-height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          color: #333;
        }

        .issue-btn {
          padding: 8px 16px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .issue-btn:hover {
          background-color: #004d40;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .search-input, .status-filter {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .icons span {
          font-size: 18px;
          margin-left: 8px;
          cursor: pointer;
        }

        .issue-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .issue-table th, .issue-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .issue-table th {
          background-color: #00796b;
          color: white;
        }

        .table-row:hover {
          background-color: #f0f0f0;
        }

        .status-issued {
          color: #d32f2f;
          font-weight: bold;
        }

        .status-returned {
          color: #388e3c;
          font-weight: bold;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          margin-right: 8px;
          transition: transform 0.2s;
        }

        .return-btn {
          background-color: #d32f2f;
          color: white;
          padding: 4px 8px;
          border-radius: 5px;
        }

        .return-btn:hover {
          background-color: #b71c1c;
        }

        .delete-btn:hover {
          transform: scale(1.2);
          color: #b71c1c;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background-color: #fff;
          padding: 15px;
          border-radius: 5px;
          width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .popup-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .popup-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 15px;
        }

        .save-btn, .cancel-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn {
          background-color: #00796b;
          color: white;
        }

        .save-btn:hover {
          background-color: #004d40;
        }

        .cancel-btn {
          background-color: #ddd;
          color: #333;
        }

        .cancel-btn:hover {
          background-color: #bbb;
        }

        @media (max-width: 768px) {
          .issue-container {
            padding: 10px;
          }
          .issue-table th, .issue-table td {
            font-size: 12px;
            padding: 6px;
          }
          .popup-content {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default IssueItemList;