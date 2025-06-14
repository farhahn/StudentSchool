import React, { useState } from 'react';

const TransportFees = () => {
  const [classes] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4']);
  const [sections] = useState(['A', 'B', 'C', 'D']);
  const [students] = useState([
    { admissionNo: '120020', studentName: 'Ashwani Kumar', class: 'Class 1(A)', fatherName: 'Arjun Kumar', dob: '09/25/2009', route: 'Brooklyn Central', vehicleNo: 'VH1001', pickupPoint: 'Brooklyn North' },
    { admissionNo: '120029', studentName: 'Ashwani Kumar', class: 'Class 1(A)', fatherName: 'Arjun Kumar', dob: '09/25/2009', route: 'Brooklyn Central', vehicleNo: 'VH4584', pickupPoint: 'Brooklyn North' },
    { admissionNo: '120039', studentName: 'Nathan Smith', class: 'Class 1(A)', fatherName: 'Jason Smith', dob: '10/24/2013', route: 'Brooklyn West', vehicleNo: 'VH4584', pickupPoint: 'Brooklyn South' },
    { admissionNo: '120049', studentName: 'Xavier Bartlett', class: 'Class 1(A)', fatherName: 'David Bartlett', dob: '05/13/2009', route: 'Brooklyn East', vehicleNo: 'VH4584', pickupPoint: 'Brooklyn North' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [criteria, setCriteria] = useState({ class: '', section: '' });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showData, setShowData] = useState(false);

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria, [name]: value });
  };

  const handleSearch = () => {
    if (criteria.class && criteria.section) {
      const filtered = students.filter(student =>
        student.class === `${criteria.class}(${criteria.section})` &&
        (searchTerm === '' || student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
      setShowData(true);
    } else {
      alert('Please select both Class and Section.');
    }
  };

  const handleDelete = (admissionNo) => {
    if (window.confirm(`Are you sure you want to delete student with Admission No: ${admissionNo}?`)) {
      setFilteredStudents(filteredStudents.filter(student => student.admissionNo !== admissionNo));
    }
  };

  const handleAssignFees = (admissionNo) => {
    // This could be modified to use React Router or your preferred navigation method
    window.location.href = `/assign-fees/${admissionNo}`;
  };

  return (
    <div className="transport-container">
      <div className="criteria-section">
        <h3>Select Criteria</h3>
        <div className="criteria-form">
          <div>
            <label>Class *</label>
            <select name="class" value={criteria.class} onChange={handleCriteriaChange} className="form-input">
              <option value="">Select</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Section</label>
            <select name="section" value={criteria.section} onChange={handleCriteriaChange} className="form-input">
              <option value="">Select</option>
              {sections.map((sec, index) => (
                <option key={index} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="transport-section">
        <h3>Student Transport Fees</h3>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by Name or Admission No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {showData && (
          <div>
            <table className="transport-table">
              <thead>
                <tr>
                  {['Admission No', 'Student Name', 'Class', 'Father Name', 'Date of Birth', 'Route Title', 'Vehicle Number', 'Pickup Point', 'Action'].map(header => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.admissionNo} className="transport-row">
                    <td>{student.admissionNo}</td>
                    <td>{student.studentName}</td>
                    <td>{student.class}</td>
                    <td>{student.fatherName}</td>
                    <td>{student.dob}</td>
                    <td>{student.route}</td>
                    <td>{student.vehicleNo}</td>
                    <td>{student.pickupPoint}</td>
                    <td>
                      <button className="action-btn edit-btn" disabled>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="action-btn assign-fees-btn" onClick={() => handleAssignFees(student.admissionNo)}>
                        <span role="img" aria-label="assign-fees">💰</span>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(student.admissionNo)}>
                        <span role="img" aria-label="delete">❌</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">Records: 1 to {filteredStudents.length} of {filteredStudents.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated CSS with new assign fees button styling
const styles = `
  .transport-container {
    padding: 20px;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
    min-height: 100vh;
    overflow-x: hidden;
    color: #333;
  }

  .criteria-section, .transport-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
    transition: all 0.3s ease;
  }

  h3 {
    margin-bottom: 20px;
    font-size: 1.8em;
    font-weight: 600;
    color: #00796b;
  }

  .criteria-form {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-bottom: 15px;
  }

  .criteria-form div {
    flex: 1;
    min-width: 160px;
  }

  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #b2ebf2;
    border-radius: 8px;
    font-size: 1em;
    background-color: #e0f7fa;
    transition: 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #00796b;
    background-color: #ffffff;
  }

  .search-btn {
    padding: 10px 20px;
    background-color: #00796b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  .search-btn:hover {
    background-color: #004d40;
  }

  .controls {
    margin-bottom: 15px;
  }

  .search-input {
    padding: 10px;
    width: 240px;
    border: 1px solid #b2ebf2;
    border-radius: 8px;
    font-size: 1em;
    background-color: #e0f7fa;
    transition: 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #00796b;
    background-color: #ffffff;
  }

  .transport-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95em;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
  }

  .transport-table th,
  .transport-table td {
    padding: 12px 10px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  .transport-table th {
    background-color: #b2ebf2;
    color: #004d40;
    font-weight: 600;
  }

  .transport-row:hover {
    background-color: #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
    margin-right: 8px;
    transition: transform 0.2s;
  }

  .action-btn:hover {
    transform: scale(1.2);
  }

  .edit-btn {
    color: #388e3c;
  }

  .assign-fees-btn {
    color: #1976d2;
  }

  .delete-btn {
    color: #d32f2f;
  }

  .pagination {
    text-align: right;
    font-size: 0.85em;
    color: #555;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    .criteria-form {
      flex-direction: column;
      gap: 10px;
    }

    .search-input {
      width: 100%;
    }

    .transport-table th,
    .transport-table td {
      font-size: 0.85em;
      padding: 8px;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default TransportFees;