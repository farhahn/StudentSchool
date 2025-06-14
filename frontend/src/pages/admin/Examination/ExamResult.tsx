import React, { useState } from 'react';

const ExamResult = () => {
  // State for dropdown selections
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Dropdown options
  const examGroups = ["Class 4 (Pass / Fail)", "Class 5 (Pass / Fail)"];
  const examTypes = ["FINAL EXAM (March-2025)", "Mid-Term (Sept-2024)"];
  const sessions = ["2018-19", "2019-20"];
  const classes = ["Class 1", "Class 2"];
  const sections = ["A", "B"];

  // Dummy data for exam results
  const examResults = [
    {
      admissionNo: "12345",
      rollNumber: "R001",
      studentName: "John Doe",
      englishMarks: 85,
      hindiMarks: 78,
      mathematicsMarks: 90,
      scienceMarks: 88,
      percent: 85.25,
      rank: 1,
      result: "Pass",
      examGroup: "Class 4 (Pass / Fail)",
      examType: "FINAL EXAM (March-2025)",
      session: "2018-19",
      class: "Class 1",
      section: "A"
    },
    {
      admissionNo: "12346",
      rollNumber: "R002",
      studentName: "Jane Smith",
      englishMarks: 92,
      hindiMarks: 85,
      mathematicsMarks: 88,
      scienceMarks: 90,
      percent: 88.75,
      rank: 2,
      result: "Pass",
      examGroup: "Class 4 (Pass / Fail)",
      examType: "FINAL EXAM (March-2025)",
      session: "2018-19",
      class: "Class 1",
      section: "A"
    }
  ];

  // Handle search based on criteria
  const handleSearch = () => {
    const filtered = examResults.filter(result => {
      const groupMatch = !selectedExamGroup || result.examGroup === selectedExamGroup;
      const typeMatch = !selectedExamType || result.examType === selectedExamType;
      const sessionMatch = !selectedSession || result.session === selectedSession;
      const classMatch = !selectedClass || result.class === selectedClass;
      const sectionMatch = !selectedSection || result.section === selectedSection;
      return groupMatch && typeMatch && sessionMatch && classMatch && sectionMatch;
    });
    setFilteredData(filtered);
  };

  // Handle sorting
  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle numerical sorting for marks, percent, and rank
      if (['englishMarks', 'hindiMarks', 'mathematicsMarks', 'scienceMarks', 'percent', 'rank'].includes(column)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) return newSortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  // Render table headers with sort indicators
  const renderTableHeaders = () => {
    const headers = [
      { label: 'Admission No', key: 'admissionNo' },
      { label: 'Roll Number', key: 'rollNumber' },
      { label: 'Student Name', key: 'studentName' },
      { label: 'English', key: 'englishMarks' },
      { label: 'Hindi', key: 'hindiMarks' },
      { label: 'Mathematics', key: 'mathematicsMarks' },
      { label: 'Science', key: 'scienceMarks' },
      { label: 'Grand Total', key: 'grandTotal' },
      { label: 'Percent (%)', key: 'percent' },
      { label: 'Rank', key: 'rank' },
      { label: 'Result', key: 'result' }
    ];

    return headers.map(header => (
      <th
        key={header.key}
        style={tableHeaderStyle}
        onClick={() => handleSort(header.key)}
      >
        {header.label}
        {sortColumn === header.key && (
          <span style={{ marginLeft: '5px' }}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </th>
    ));
  };

  // Render table rows
  const renderTableRows = () => {
    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="11" style={noDataStyle}>
            No data available in table
          </td>
        </tr>
      );
    }

    return filteredData.map((result, index) => (
      <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
        <td style={tableCellStyle}>{result.admissionNo}</td>
        <td style={tableCellStyle}>{result.rollNumber}</td>
        <td style={tableCellStyle}>{result.studentName}</td>
        <td style={tableCellStyle}>{result.englishMarks}/100.00 - 210</td>
        <td style={tableCellStyle}>{result.hindiMarks}/100.00 - 230</td>
        <td style={tableCellStyle}>{result.mathematicsMarks}/100.00 - 110</td>
        <td style={tableCellStyle}>{result.scienceMarks}/100.00 - 111</td>
        <td style={tableCellStyle}>
          {(result.englishMarks + result.hindiMarks + result.mathematicsMarks + result.scienceMarks).toFixed(2)}/400.00
        </td>
        <td style={tableCellStyle}>{result.percent.toFixed(2)}</td>
        <td style={tableCellStyle}>{result.rank}</td>
        <td style={tableCellStyle}>{result.result}</td>
      </tr>
    ));
  };

  return (
    <div style={containerStyle}>
      {/* Select Criteria Section */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Select Criteria</h2>
        <div style={dropdownsContainerStyle}>
          <div style={dropdownWrapperStyle}>
            <label style={labelStyle}>
              Exam Group <span style={requiredStyle}>*</span>
            </label>
            <select
              style={selectStyle}
              value={selectedExamGroup}
              onChange={(e) => setSelectedExamGroup(e.target.value)}
            >
              <option value="">Select Exam Group</option>
              {examGroups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div style={dropdownWrapperStyle}>
            <label style={labelStyle}>
              Exam <span style={requiredStyle}>*</span>
            </label>
            <select
              style={selectStyle}
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="">Select Exam</option>
              {examTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div style={dropdownWrapperStyle}>
            <label style={labelStyle}>
              Session <span style={requiredStyle}>*</span>
            </label>
            <select
              style={selectStyle}
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">Select Session</option>
              {sessions.map((session, index) => (
                <option key={index} value={session}>{session}</option>
              ))}
            </select>
          </div>
          <div style={dropdownWrapperStyle}>
            <label style={labelStyle}>
              Class <span style={requiredStyle}>*</span>
            </label>
            <select
              style={selectStyle}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div style={dropdownWrapperStyle}>
            <label style={labelStyle}>
              Section <span style={requiredStyle}>*</span>
            </label>
            <select
              style={selectStyle}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {sections.map((section, index) => (
                <option key={index} value={section}>{section}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <button style={searchButtonStyle} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Exam Result Section */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Exam Result</h2>
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
        <div style={actionButtonsStyle}>
          <button style={actionButtonStyle}>Download</button>
          <button style={actionButtonStyle}>Print</button>
          <button style={actionButtonStyle}>Column Visibility</button>
          <button style={actionButtonStyle}>Search</button>
        </div>
      </div>
    </div>
  );
};

// Internal CSS Styles
const containerStyle = {
  padding: '2rem',
  backgroundColor: "#e8c897",
  minHeight: '100vh',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const sectionStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const headingStyle = {
  color: '#333',
  fontSize: '1.5rem',
  marginBottom: '1rem',
  fontWeight: '600'
};

const dropdownsContainerStyle = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap'
};

const dropdownWrapperStyle = {
  flex: '1',
  minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  fontSize: '1rem',
  color: '#333',
  fontWeight: '500'
};

const requiredStyle = {
  color: 'red'
};

const selectStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none',
  cursor: 'pointer'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '1rem'
};

const searchButtonStyle = {
  padding: '0.5rem 1.5rem',
  background: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.3s'
};

const tableWrapperStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const tableHeaderRowStyle = {
  background: '#f8f9fa'
};

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  color: '#333',
  fontWeight: '500',
  cursor: 'pointer'
};

const tableCellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #dee2e6',
  color: '#555'
};

const evenRowStyle = {
  background: '#ffffff'
};

const oddRowStyle = {
  background: '#f8f9fa'
};

const noDataStyle = {
  padding: '1rem',
  textAlign: 'center',
  color: '#dc3545',
  fontStyle: 'italic'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'flex-end',
  marginTop: '1rem'
};

const actionButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: '#333'
};

export default ExamResult;