import React, { useState } from 'react';

const FeesCarryForward = () => {
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [editedBalances, setEditedBalances] = useState<{[key: number]: number}>({});

  const students = [
    {
      id: 1,
      name: 'Avan Desai',
      admissionNo: 120036,
      admissionDate: '10/10/2024',
      dueDate: '12/31/2024',
      rollNumber: 23620,
      fatherName: 'Abhinand',
      balance: 150.00
    },
    // Add other students
  ];

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      student.admissionNo.toString().includes(appliedSearch)
    )
    .map(student => ({
      ...student,
      balance: editedBalances[student.id] !== undefined ? editedBalances[student.id] : student.balance
    }));

  const handleSave = () => {
    console.log('Saved balances:', editedBalances);
    alert('Changes saved successfully!');
    setEditedBalances({});
  };

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#e8c897',
      minHeight: '100vh'
    },
    header: {
      fontSize: '1.75rem',
      fontWeight: '600',
      marginBottom: '2rem',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    filtersContainer: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    select: {
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      backgroundColor: 'white',
      fontSize: '1rem',
      minWidth: '200px',
      cursor: 'pointer',
      background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234b5563\' stroke-width=\'2\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3e%3c/svg%3e") no-repeat right 1rem center/1rem'
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      alignItems: 'center'
    },
    searchInput: {
      flex: 1,
      padding: '0.875rem 1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      fontSize: '1rem',
      paddingLeft: '2.5rem',
      background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'/%3e%3c/svg%3e") no-repeat 1rem center/1.2rem'
    },
    searchButton: {
      padding: '0.875rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#6366f1',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#4f46e5',
        transform: 'translateY(-1px)'
      }
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    tableHeader: {
      backgroundColor: '#6366f1',
      color: 'white',
      padding: '1rem',
      textAlign: 'left',
      fontSize: '0.9rem'
    },
    tableRow: {
      borderBottom: '1px solid #e2e8f0',
      transition: 'background-color 0.2s ease',
      ':nth-child(even)': {
        backgroundColor: '#f8fafc'
      },
      ':hover': {
        backgroundColor: '#f1f5f9'
      }
    },
    tableCell: {
      padding: '1rem',
      color: '#1e293b',
      fontSize: '0.9rem'
    },
    dueDate: {
      color: '#ef4444',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    balanceInput: {
      width: '100px',
      padding: '0.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '6px',
      textAlign: 'right',
      transition: 'all 0.2s ease',
      ':focus': {
        outline: 'none',
        borderColor: '#6366f1',
        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
      }
    },
    saveButton: {
      marginTop: '1.5rem',
      padding: '0.875rem 1.5rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#059669',
        transform: 'translateY(-1px)'
      },
      ':disabled': {
        backgroundColor: '#cbd5e1',
        cursor: 'not-allowed'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        Fees Carry Forward
      </h1>

      <div style={styles.filtersContainer}>
        <select 
          style={styles.select}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {['Class 1', 'Class 2', 'Class 3', 'Class 4'].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          {['A', 'B', 'C', 'D'].map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search students..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          style={styles.searchButton}
          onClick={() => setAppliedSearch(searchQuery)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Search
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Student Name</th>
            <th style={styles.tableHeader}>Admission No</th>
            <th style={styles.tableHeader}>Admission Date</th>
            <th style={styles.tableHeader}>Due Date</th>
            <th style={styles.tableHeader}>Roll Number</th>
            <th style={styles.tableHeader}>Father Name</th>
            <th style={styles.tableHeader}>Balance ($)</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{student.name}</td>
              <td style={styles.tableCell}>{student.admissionNo}</td>
              <td style={styles.tableCell}>{student.admissionDate}</td>
              <td style={styles.tableCell}>
                <div style={styles.dueDate}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {student.dueDate}
                </div>
              </td>
              <td style={styles.tableCell}>{student.rollNumber}</td>
              <td style={styles.tableCell}>{student.fatherName}</td>
              <td style={styles.tableCell}>
                <input
                  type="number"
                  style={styles.balanceInput}
                  value={editedBalances[student.id] ?? student.balance}
                  onChange={(e) => setEditedBalances({
                    ...editedBalances,
                    [student.id]: parseFloat(e.target.value)
                  })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        style={styles.saveButton}
        onClick={handleSave}
        disabled={Object.keys(editedBalances).length === 0}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
        Save All Changes
      </button>
    </div>
  );
};

export default FeesCarryForward;