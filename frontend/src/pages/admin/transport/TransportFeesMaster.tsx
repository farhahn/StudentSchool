import React, { useState } from 'react';

const TransportFeesMaster = () => {
  // State to manage the fees details for each month
  const [feesDetails, setFeesDetails] = useState({
    January: { dueDate: '01/05/2025', fineType: 'Percentage', percentage: '5.00', fixedAmount: '' },
    February: { dueDate: '02/05/2025', fineType: 'Fix Amount', percentage: '', fixedAmount: '30.00' },
    March: { dueDate: '03/05/2025', fineType: 'Percentage', percentage: '8.00', fixedAmount: '' },
    April: { dueDate: '04/05/2025', fineType: 'Percentage', percentage: '10.00', fixedAmount: '' },
    May: { dueDate: '05/05/2025', fineType: 'Fix Amount', percentage: '', fixedAmount: '50.00' },
    June: { dueDate: '06/05/2025', fineType: 'Fix Amount', percentage: '', fixedAmount: '50.00' },
    July: { dueDate: '07/05/2025', fineType: 'Percentage', percentage: '20.00', fixedAmount: '' },
    August: { dueDate: '08/05/2025', fineType: 'Percentage', percentage: '10.00', fixedAmount: '' },
    September: { dueDate: '09/05/2025', fineType: 'Percentage', percentage: '15.00', fixedAmount: '' },
    October: { dueDate: '10/05/2025', fineType: 'Fix Amount', percentage: '', fixedAmount: '50.00' },
    November: { dueDate: '11/05/2025', fineType: 'Percentage', percentage: '12.00', fixedAmount: '' },
    December: { dueDate: '12/05/2025', fineType: 'Fix Amount', percentage: '', fixedAmount: '40.00' },
  });

  // State to handle copy first fees detail
  const [copyFirstFees, setCopyFirstFees] = useState(false);

  // Handle input changes
  const handleChange = (month, field, value) => {
    setFeesDetails((prevDetails) => ({
      ...prevDetails,
      [month]: {
        ...prevDetails[month],
        [field]: value,
      },
    }));
  };

  // Handle fine type change
  const handleFineTypeChange = (month, fineType) => {
    setFeesDetails((prevDetails) => ({
      ...prevDetails,
      [month]: {
        ...prevDetails[month],
        fineType,
        percentage: fineType === 'Percentage' ? prevDetails[month].percentage || '0.00' : '',
        fixedAmount: fineType === 'Fix Amount' ? prevDetails[month].fixedAmount || '0.00' : '',
      },
    }));
  };

  // Copy first month's fees details to all months
  const handleCopyFirstFees = () => {
    const firstMonth = Object.keys(feesDetails)[0];
    const firstDetails = feesDetails[firstMonth];
    setFeesDetails((prevDetails) => {
      const updatedDetails = {};
      Object.keys(prevDetails).forEach((month) => {
        updatedDetails[month] = { ...firstDetails };
      });
      return updatedDetails;
    });
    setCopyFirstFees(true);
  };

  // Handle save functionality (example: log to console)
  const handleSave = () => {
    console.log('Fees Details Saved:', feesDetails);
    alert('Fees details have been saved!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Transport Fees Master</h2>
      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={copyFirstFees}
          onChange={handleCopyFirstFees}
          style={styles.checkbox}
        />
        Copy First Fees Detail For All Months
      </label>

      <div style={styles.monthsContainer}>
        {Object.keys(feesDetails).map((month) => (
          <div key={month} style={styles.monthContainer}>
            <h3 style={styles.monthTitle}>{month}</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Due Date</label>
              <input
                type="text"
                value={feesDetails[month].dueDate}
                onChange={(e) => handleChange(month, 'dueDate', e.target.value)}
                style={styles.input}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fine Type</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="None"
                    checked={feesDetails[month].fineType === 'None'}
                    onChange={() => handleFineTypeChange(month, 'None')}
                    style={styles.radio}
                  />
                  None
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="Percentage"
                    checked={feesDetails[month].fineType === 'Percentage'}
                    onChange={() => handleFineTypeChange(month, 'Percentage')}
                    style={styles.radio}
                  />
                  Percentage (%)
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="Fix Amount"
                    checked={feesDetails[month].fineType === 'Fix Amount'}
                    onChange={() => handleFineTypeChange(month, 'Fix Amount')}
                    style={styles.radio}
                  />
                  Fix Amount ($)
                </label>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={feesDetails[month].percentage}
                onChange={(e) => handleChange(month, 'percentage', e.target.value)}
                style={styles.input}
                placeholder="0.00"
                disabled={feesDetails[month].fineType !== 'Percentage'}
              />
              <input
                type="text"
                value={feesDetails[month].fixedAmount}
                onChange={(e) => handleChange(month, 'fixedAmount', e.target.value)}
                style={styles.input}
                placeholder="0.00"
                disabled={feesDetails[month].fineType !== 'Fix Amount'}
              />
            </div>
          </div>
        ))}
      </div>

      <button style={styles.saveButton} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px', // Increased width to accommodate side-by-side months
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    color: '#555',
  },
  checkbox: {
    marginRight: '10px',
  },
  monthsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px', // Space between month sections
    justifyContent: 'space-between',
  },
  monthContainer: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    flex: '1 1 calc(25% - 20px)', // Approximately 4 months per row with gap
    minWidth: '250px', // Minimum width to ensure readability
  },
  monthTitle: {
    color: '#2c3e50',
    marginBottom: '10px',
  },
  inputGroup: {
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    color: '#666',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  radioGroup: {
    display: 'flex',
    gap: '15px',
  },
  radioLabel: {
    color: '#555',
  },
  radio: {
    marginRight: '5px',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    transition: 'background-color 0.3s',
  },
};

export default TransportFeesMaster;