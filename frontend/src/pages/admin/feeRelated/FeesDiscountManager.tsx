import React, { useState } from 'react';

const FeesDiscountManager = () => {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      name: 'Sibling Discount',
      code: 'sibling-disc',
      type: 'amount',
      percentage: '',
      amount: 500,
      useCount: 5,
      expiry: '2025-03-15',
      description: ''
    },
    // Add other initial discounts
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage',
    percentage: '',
    amount: '',
    useCount: '',
    expiry: '',
    description: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newDiscount = {
      id: Date.now(),
      ...formData,
      percentage: formData.type === 'percentage' ? formData.percentage : '',
      amount: formData.type === 'amount' ? formData.amount : ''
    };

    if (editingId) {
      setDiscounts(discounts.map(d => d.id === editingId ? newDiscount : d));
    } else {
      setDiscounts([...discounts, newDiscount]);
    }

    setFormData({
      name: '',
      code: '',
      type: 'percentage',
      percentage: '',
      amount: '',
      useCount: '',
      expiry: '',
      description: ''
    });
    setEditingId(null);
  };

  const filteredDiscounts = discounts.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#e8c897'
    },
    header: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '2rem',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    inputGroup: {
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#475569',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      ':focus': {
        outline: 'none',
        borderColor: '#6366f1',
        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
      }
    },
    switchContainer: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    switchButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: '2px solid #e2e8f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      ':hover': {
        borderColor: '#6366f1'
      }
    },
    activeSwitch: {
      backgroundColor: '#6366f1',
      color: 'white',
      borderColor: '#6366f1'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      padding: '0.875rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
      }
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    },
    searchInput: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      paddingLeft: '2.5rem',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\' /%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '1rem center',
      backgroundSize: '1rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      textAlign: 'left',
      color: '#64748b',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    tableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#f8fafc'
      }
    },
    tableCell: {
      padding: '1rem',
      color: '#1e293b',
      fontSize: '0.9rem'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      margin: '0 0.25rem',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Manage Fee Discounts
      </h1>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Discount Name *</label>
              <input
                style={styles.input}
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Discount Code *</label>
              <input
                style={styles.input}
                type="text"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={styles.switchContainer}>
            <button
              type="button"
              style={{
                ...styles.switchButton,
                ...(formData.type === 'percentage' && styles.activeSwitch)
              }}
              onClick={() => setFormData({...formData, type: 'percentage'})}
            >
              Percentage
            </button>
            <button
              type="button"
              style={{
                ...styles.switchButton,
                ...(formData.type === 'amount' && styles.activeSwitch)
              }}
              onClick={() => setFormData({...formData, type: 'amount'})}
            >
              Fixed Amount
            </button>
          </div>

          <div style={styles.formGrid}>
            {formData.type === 'percentage' ? (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Percentage (%) *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.percentage}
                  onChange={e => setFormData({...formData, percentage: e.target.value})}
                  required
                />
              </div>
            ) : (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount ($) *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Use Count</label>
              <input
                style={styles.input}
                type="number"
                value={formData.useCount}
                onChange={e => setFormData({...formData, useCount: e.target.value})}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input
                style={styles.input}
                type="date"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: e.target.value})}
              />
            </div>
          </div>

          <button style={styles.primaryButton} type="submit">
            {editingId ? 'Update Discount' : 'Create Discount'}
          </button>
        </form>
      </div>

      <div style={styles.tableContainer}>
        <input
          type="text"
          placeholder="Search discounts..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Code</th>
              <th style={styles.tableHeader}>Percentage</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Use Count</th>
              <th style={styles.tableHeader}>Expiry Date</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.map(d => (
              <tr key={d.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{d.name}</td>
                <td style={styles.tableCell}>{d.code}</td>
                <td style={styles.tableCell}>{d.percentage || '-'}</td>
                <td style={styles.tableCell}>{d.amount ? `$${d.amount}` : '-'}</td>
                <td style={styles.tableCell}>{d.useCount || 'Unlimited'}</td>
                <td style={styles.tableCell}>{d.expiry || '-'}</td>
                <td style={styles.tableCell}>
                  <button
                    style={{...styles.actionButton, backgroundColor: '#e0f2fe', color: '#0369a1'}}
                    onClick={() => {
                      setFormData(d);
                      setEditingId(d.id);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={{...styles.actionButton, backgroundColor: '#fee2e2', color: '#dc2626'}}
                    onClick={() => setDiscounts(discounts.filter(item => item.id !== d.id))}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeesDiscountManager;