import React, { useState } from 'react';

const MarkDivision = () => {
  const [divisions, setDivisions] = useState([
    { name: 'First', percentFrom: 100.00, percentUpto: 60.00 },
    { name: 'Second', percentFrom: 60.00, percentUpto: 40.00 },
    { name: 'Third', percentFrom: 40.00, percentUpto: 0.00 },
  ]);

  const [formData, setFormData] = useState({
    divisionName: '',
    percentFrom: '',
    percentUpto: '',
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.divisionName.trim()) {
      newErrors.divisionName = 'Division name is required';
    }
    if (!formData.percentFrom || isNaN(formData.percentFrom)) {
      newErrors.percentFrom = 'Invalid percentage';
    }
    if (!formData.percentUpto || isNaN(formData.percentUpto)) {
      newErrors.percentUpto = 'Invalid percentage';
    }
    if (parseFloat(formData.percentFrom) <= parseFloat(formData.percentUpto)) {
      newErrors.range = 'From percentage must be greater than To percentage';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newDivision = {
      name: formData.divisionName,
      percentFrom: parseFloat(formData.percentFrom),
      percentUpto: parseFloat(formData.percentUpto),
    };

    if (editingIndex !== null) {
      const updatedDivisions = [...divisions];
      updatedDivisions[editingIndex] = newDivision;
      setDivisions(updatedDivisions);
    } else {
      setDivisions([...divisions, newDivision]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ divisionName: '', percentFrom: '', percentUpto: '' });
    setEditingIndex(null);
    setErrors({});
  };

  const handleEdit = (index) => {
    const division = divisions[index];
    setFormData({
      divisionName: division.name,
      percentFrom: division.percentFrom,
      percentUpto: division.percentUpto,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setDivisions(divisions.filter((_, i) => i !== index));
    if (editingIndex === index) resetForm();
  };

  return (
    <div className="mark-division-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          .mark-division-container {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg,rgb(225, 163, 61) 0%, #e9ecef 100%);
            padding: 2rem;
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 2rem;
            align-items: start;
          }

          .form-section, .table-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .form-section:hover, .table-section:hover {
            transform: translateY(-2px);
          }

          h2 {
            color: #2d3436;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 0.5rem;
          }

          h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 3px;
            background: linear-gradient(90deg, #6c5ce7 0%, #a66efa 100%);
            border-radius: 2px;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          label {
            display: block;
            font-size: 0.875rem;
            color: #4a5568;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: #f8fafc;
          }

          input:focus {
            outline: none;
            border-color: #a66efa;
            box-shadow: 0 0 0 3px rgba(166, 110, 250, 0.15);
            background: white;
          }

          .error {
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            display: block;
          }

          .button-group {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }

          .save-btn {
            background: linear-gradient(90deg, #6c5ce7 0%, #a66efa 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .save-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px -2px rgba(108, 92, 231, 0.3);
          }

          .cancel-btn {
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #e2e8f0;
          }

          .cancel-btn:hover {
            background: #e2e8f0;
          }

          .table-section {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 0.75rem;
            overflow: hidden;
          }

          th, td {
            padding: 1rem 1.5rem;
            text-align: left;
            font-size: 0.875rem;
          }

          thead {
            background: linear-gradient(90deg, #6c5ce7 0%, #a66efa 100%);
            color: white;
          }

          th {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }

          tbody tr {
            border-bottom: 1px solid #f1f5f9;
            transition: background 0.2s ease;
          }

          tbody tr:hover {
            background: #f8fafc;
          }

          .action-buttons {
            display: flex;
            gap: 0.5rem;
          }

          .icon-btn {
            padding: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .edit-btn {
            color: #6c5ce7;
          }

          .edit-btn:hover {
            background: rgba(108, 92, 231, 0.1);
          }

          .delete-btn {
            color: #ef4444;
          }

          .delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
          }

          @media (max-width: 1024px) {
            .mark-division-container {
              grid-template-columns: 1fr;
              padding: 1rem;
            }
          }
        `}
      </style>

      {/* Form Section */}
      <div className="form-section">
        <h2>{editingIndex !== null ? '✏️ Edit Division' : '➕ Add New Division'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Division Name</label>
            <input
              type="text"
              name="divisionName"
              value={formData.divisionName}
              onChange={(e) => setFormData({...formData, divisionName: e.target.value})}
              placeholder="Enter division name"
            />
            {errors.divisionName && <span className="error">{errors.divisionName}</span>}
          </div>

          <div className="form-group">
            <label>Percentage From</label>
            <input
              type="number"
              name="percentFrom"
              value={formData.percentFrom}
              onChange={(e) => setFormData({...formData, percentFrom: e.target.value})}
              placeholder="Starting percentage"
              step="0.01"
            />
            {errors.percentFrom && <span className="error">{errors.percentFrom}</span>}
          </div>

          <div className="form-group">
            <label>Percentage Upto</label>
            <input
              type="number"
              name="percentUpto"
              value={formData.percentUpto}
              onChange={(e) => setFormData({...formData, percentUpto: e.target.value})}
              placeholder="Ending percentage"
              step="0.01"
            />
            {errors.percentUpto && <span className="error">{errors.percentUpto}</span>}
          </div>

          {errors.range && <span className="error">{errors.range}</span>}

          <div className="button-group">
            <button type="submit" className="save-btn">
              {editingIndex !== null ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Update Division
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Create Division
                </>
              )}
            </button>
            
            {editingIndex !== null && (
              <button type="button" className="save-btn cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <h2>📋 Division List</h2>
        <table>
          <thead>
            <tr>
              <th>Division</th>
              <th>From (%)</th>
              <th>To (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {divisions.map((division, index) => (
              <tr key={index}>
                <td>{division.name}</td>
                <td>{division.percentFrom.toFixed(2)}</td>
                <td>{division.percentUpto.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-btn edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                      </svg>
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkDivision;