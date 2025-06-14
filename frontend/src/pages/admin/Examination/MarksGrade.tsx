import React, { useState } from 'react';

const MarkGrade = () => {
  const [divisions, setDivisions] = useState([
    { id: 1, name: 'First', from: 100.0, to: 60.0 },
    { id: 2, name: 'Second', from: 60.0, to: 40.0 },
    { id: 3, name: 'Third', from: 40.0, to: 0.0 }
  ]);

  const [newDivision, setNewDivision] = useState({ name: '', from: '', to: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // CSS Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      color: '#2c3e50',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem'
    },
    formContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: '1rem',
      marginBottom: '2rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    input: {
      padding: '0.8rem',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'all 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)'
    },
    error: {
      color: '#e74c3c',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    addButton: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      alignSelf: 'flex-end',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#219a52'
      }
    },
    cancelButton: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '1.5rem 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '2px solid #e0e0e0',
      color: '#2c3e50',
      fontWeight: '600'
    },
    tableRow: {
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#f8f9fa'
      }
    },
    tableCell: {
      padding: '1rem',
      color: '#444'
    },
    actionCell: {
      display: 'flex',
      gap: '1rem'
    },
    actionButton: {
      padding: '8px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '36px',
      height: '36px',
      '&:hover': {
        backgroundColor: 'rgba(52, 152, 219, 0.1)'
      }
    },
    deleteButton: {
      '&:hover': {
        backgroundColor: 'rgba(231, 76, 60, 0.1)'
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newDivision.name.trim()) {
      newErrors.name = 'Division name is required';
    }
    if (isNaN(newDivision.from) || newDivision.from === '') {
      newErrors.from = 'Invalid percentage';
    }
    if (isNaN(newDivision.to) || newDivision.to === '') {
      newErrors.to = 'Invalid percentage';
    }
    if (parseFloat(newDivision.from) <= parseFloat(newDivision.to)) {
      newErrors.range = 'From percentage must be greater than To percentage';
    }
    return newErrors;
  };

  const handleAddDivision = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newEntry = {
      id: editingId || divisions.length + 1,
      name: newDivision.name,
      from: parseFloat(newDivision.from),
      to: parseFloat(newDivision.to)
    };

    if (editingId) {
      setDivisions(divisions.map(div => div.id === editingId ? newEntry : div));
      setEditingId(null);
    } else {
      setDivisions([...divisions, newEntry]);
    }

    setNewDivision({ name: '', from: '', to: '' });
    setErrors({});
  };

  const handleEdit = (division) => {
    setNewDivision({
      name: division.name,
      from: division.from.toString(),
      to: division.to.toString()
    });
    setEditingId(division.id);
  };

  const handleDelete = (id) => {
    setDivisions(divisions.filter(division => division.id !== id));
  };

  const ActionButton = ({ children, onClick, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <button
        style={{
          ...styles.actionButton,
          ...(isHovered && style?.hover),
          ...style?.base
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        {editingId ? 'Edit Division' : 'Add Marks Division'}
      </h2>

      <div style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Division Name"
            style={{
              ...styles.input,
              ...(errors.name && { borderColor: '#e74c3c' }),
              ...(document.activeElement === document.querySelector('input[placeholder="Division Name"]') && styles.inputFocus)
            }}
            value={newDivision.name}
            onChange={(e) => setNewDivision({...newDivision, name: e.target.value})}
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>
        
        <div style={styles.inputGroup}>
          <input
            type="number"
            placeholder="Percentage From"
            style={{
              ...styles.input,
              ...(errors.from && { borderColor: '#e74c3c' }),
              ...(document.activeElement === document.querySelector('input[placeholder="Percentage From"]') && styles.inputFocus)
            }}
            value={newDivision.from}
            onChange={(e) => setNewDivision({...newDivision, from: e.target.value})}
            step="0.01"
          />
          {errors.from && <span style={styles.error}>{errors.from}</span>}
        </div>
        
        <div style={styles.inputGroup}>
          <input
            type="number"
            placeholder="Percentage Upto"
            style={{
              ...styles.input,
              ...(errors.to && { borderColor: '#e74c3c' }),
              ...(document.activeElement === document.querySelector('input[placeholder="Percentage Upto"]') && styles.inputFocus)
            }}
            value={newDivision.to}
            onChange={(e) => setNewDivision({...newDivision, to: e.target.value})}
            step="0.01"
          />
          {errors.to && <span style={styles.error}>{errors.to}</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            style={styles.addButton}
            onClick={handleAddDivision}
          >
            {editingId ? 'Update Division' : 'Add Division'}
          </button>
          {editingId && (
            <button
              style={styles.cancelButton}
              onClick={() => {
                setEditingId(null);
                setNewDivision({ name: '', from: '', to: '' });
                setErrors({});
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {errors.range && <span style={{ ...styles.error, marginBottom: '1rem' }}>{errors.range}</span>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Division Name</th>
            <th style={styles.tableHeader}>Percentage From</th>
            <th style={styles.tableHeader}>Percentage Upto</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {divisions.map((division) => (
            <tr key={division.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{division.name}</td>
              <td style={styles.tableCell}>{division.from.toFixed(2)}</td>
              <td style={styles.tableCell}>{division.to.toFixed(2)}</td>
              <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                <ActionButton
                  onClick={() => handleEdit(division)}
                  style={{
                    base: { backgroundColor: 'transparent' },
                    hover: { backgroundColor: 'rgba(52, 152, 219, 0.1)' }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3498db">
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                  </svg>
                </ActionButton>
                <ActionButton
                  onClick={() => handleDelete(division.id)}
                  style={{
                    base: { backgroundColor: 'transparent' },
                    hover: { backgroundColor: 'rgba(231, 76, 60, 0.1)' }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkGrade;