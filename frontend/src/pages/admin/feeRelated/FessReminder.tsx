import React, { useState } from 'react';

const FessReminder = () => {
  const [reminders, setReminders] = useState([
    { id: 1, action: 'Active', type: 'before', days: 2 },
    { id: 2, action: 'Active', type: 'before', days: 5 },
    { id: 3, action: 'Active', type: 'after', days: 2 },
    { id: 4, action: 'Active', type: 'after', days: 5 },
  ]);

  const containerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    padding: '2rem',
  };

  const titleStyle = {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  };

  const tableHeaderStyle = {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tableCellStyle = {
    padding: '1rem',
    textAlign: 'left',
  };

  const statusActiveStyle = {
    color: '#27ae60',
    fontWeight: '600',
  };

  const getReminderTypeStyle = (type) => ({
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    background: type === 'before' ? '#e8f5e9' : '#ffeef0',
    color: type === 'before' ? '#2ecc71' : '#e74c3c',
  });

  const saveButtonStyle = {
    background: '#3498db',
    color: 'white',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'block',
    margin: '1.5rem auto 0',
    boxShadow: '0 3px 6px rgba(52, 152, 219, 0.2)',
  };

  const handleSave = () => {
    console.log('Saved data:', reminders);
    alert('Changes saved successfully!');
  };

  const handleStatusChange = (id, field, value) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, [field]: value } : reminder
    );
    setReminders(updatedReminders);
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎓 Fee Reminder Management</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Action</th>
            <th style={tableHeaderStyle}>Reminder Type</th>
            <th style={tableHeaderStyle}>Days</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => (
            <tr key={reminder.id} style={{ transition: 'all 0.3s ease' }}>
              <td style={tableCellStyle}>
                <select 
                  value={reminder.action}
                  onChange={(e) => handleStatusChange(reminder.id, 'action', e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </td>
              <td style={tableCellStyle}>
                <select
                  value={reminder.type}
                  onChange={(e) => handleStatusChange(reminder.id, 'type', e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                >
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </select>
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={reminder.days}
                  onChange={(e) => handleStatusChange(reminder.id, 'days', e.target.value)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '0.3rem',
                    borderRadius: '4px',
                    width: '80px',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={handleSave}
        style={saveButtonStyle}
        onMouseOver={(e) => e.target.style.background = '#2980b9'}
        onMouseOut={(e) => e.target.style.background = '#3498db'}
      >
        💾 Save Changes
      </button>

      <style>{`
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        tr:hover {
          background-color: #e9f5ff;
          transform: scale(1.02);
        }
        
        button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default FessReminder;