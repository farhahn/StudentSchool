import React, { useState } from 'react';

const ExamSchedule = () => {
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const subjects = [
    {
      name: 'English (210)',
      date: '07/05/2024',
      time: '11:00:00',
      duration: 1,
      room: 12,
      max: 100.00,
      min: 35.00,
      examGroup: 'Class 4 (Pass / Fail)',
      examType: 'Monthly Test JULY 2024'
    },
    {
      name: 'Mathematics (110)',
      date: '07/08/2024',
      time: '11:00:00',
      duration: 1,
      room: 14,
      max: 100.00,
      min: 35.00,
      examGroup: 'Class 4 (School Based Grading System)',
      examType: 'Half-Yearly Examination Dec 2024'
    },
    {
      name: 'Hindi (230)',
      date: '07/12/2024',
      time: '11:00:00',
      duration: 1,
      room: 15,
      max: 100.00,
      min: 35.00,
      examGroup: 'Class 4 (GPA Grading System)',
      examType: 'Monthly Test March 2025'
    },
    {
      name: 'Science (111)',
      date: '07/15/2024',
      time: '11:00:00',
      duration: 1,
      room: 16,
      max: 100.00,
      min: 35.00,
      examGroup: 'Average Passing Exam',
      examType: 'Final Exam Quarterly Examination Sept 2024'
    }
  ];

  const examGroups = [
    "Class 4 (Pass / Fail)",
    "Class 4 (School Based Grading System)",
    "Class 4 (College Based Grading System)",
    "Class 4 (GPA Grading System)",
    "Average Passing Exam"
  ];

  const examTypes = [
    "Monthly Test March 2025",
    "Final Exam Quarterly Examination Sept 2024",
    "Monthly Test JULY 2024",
    "Half-Yearly Examination Dec 2024"
  ];

  const handleSubjectSearch = () => {
    const filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleCriteriaSearch = () => {
    const filtered = subjects.filter(subject => {
      const groupMatch = !selectedExamGroup || subject.examGroup === selectedExamGroup;
      const typeMatch = !selectedExamType || subject.examType === selectedExamType;
      return groupMatch && typeMatch;
    });
    setFilteredSubjects(filtered);
  };

  const displayedSubjects = filteredSubjects.length > 0 ? filteredSubjects : subjects;

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Select Criteria</h2>
        
        <div style={dropdownsContainer}>
          <div style={dropdownWrapper}>
            <h3 style={subHeadingStyle}>Exam Group *</h3>
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

          <div style={dropdownWrapper}>
            <h3 style={subHeadingStyle}>Exam Type *</h3>
            <select 
              style={selectStyle}
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button 
            onClick={handleCriteriaSearch}
            style={searchButtonStyle}
          >
            Search Criteria
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Subject *</h2>
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search subject..."
            value={subjectSearchTerm}
            onChange={(e) => setSubjectSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <button 
            onClick={handleSubjectSearch}
            style={searchButtonStyle}
          >
            Search Subjects
          </button>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={tableHeader}>Subject</th>
              <th style={tableHeader}>Date From</th>
              <th style={tableHeader}>Start Time</th>
              <th style={tableHeader}>Duration</th>
              <th style={tableHeader}>Room No.</th>
              <th style={tableHeader}>Marks (Max.)</th>
              <th style={tableHeader}>Marks (Min.)</th>
              <th style={tableHeader}>Exam Group</th>
              <th style={tableHeader}>Exam Type</th>
            </tr>
          </thead>
          <tbody>
            {displayedSubjects.map((subject, index) => (
              <tr key={index} style={index % 2 === 0 ? evenRow : oddRow}>
                <td style={tableCell}>{subject.name}</td>
                <td style={tableCell}>{subject.date}</td>
                <td style={tableCell}>{subject.time}</td>
                <td style={tableCell}>{subject.duration}h</td>
                <td style={tableCell}>{subject.room}</td>
                <td style={tableCell}>{subject.max}</td>
                <td style={tableCell}>{subject.min}</td>
                <td style={tableCell}>{subject.examGroup}</td>
                <td style={tableCell}>{subject.examType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '2rem',
  backgroundColor: "#e8c897",
  minHeight: '100vh',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const sectionStyle = {
  backgroundColor: 'white',
  borderRadius: '15px',
  padding: '2rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const headingStyle = {
  color: '#2c3e50',
  marginBottom: '1.5rem',
  borderBottom: '2px solid #3498db',
  paddingBottom: '0.5rem',
  fontSize: '1.5rem'
};

const searchContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem'
};

const buttonContainerStyle = {
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'flex-end'
};

const searchInputStyle = {
  flex: '1',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '2px solid #bdc3c7',
  fontSize: '1rem'
};

const searchButtonStyle = {
  padding: '0.8rem 1.5rem',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  ':hover': {
    backgroundColor: '#2980b9'
  }
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const tableHeaderRow = {
  backgroundColor: '#f8f9fa'
};

const tableHeader = {
  padding: '1rem',
  textAlign: 'left',
  borderBottom: '2px solid #dee2e6',
  color: '#2c3e50',
  fontWeight: '600'
};

const tableCell = {
  padding: '1rem',
  borderBottom: '1px solid #dee2e6',
  color: '#34495e'
};

const evenRow = {
  backgroundColor: '#ffffff'
};

const oddRow = {
  backgroundColor: '#f8f9fa'
};

const dropdownsContainer = {
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap'
};

const dropdownWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const subHeadingStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '0.5rem'
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
};

export default ExamSchedule;