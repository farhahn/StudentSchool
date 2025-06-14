import React, { useState, useEffect } from 'react';

const PromoteStudents = () => {
  // Sample data for classes, sections, sessions, and students
  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  const sections = ["A", "B", "C"];
  const sessions = ["2017-18", "2018-19", "2019-20"];

  const studentData = [
    { admissionNo: "1001", name: "Hudson", fatherName: "Emrys", dob: "02/06/2019", currentResult: "Pass", nextSessionStatus: "Continue", selected: false },
    { admissionNo: "1020", name: "Marlie", fatherName: "Lester", dob: "05/22/2019", currentResult: "Pass", nextSessionStatus: "Continue", selected: false },
    { admissionNo: "2152", name: "Kaylen", fatherName: "Lyndon", dob: "06/19/2019", currentResult: "Pass", nextSessionStatus: "Continue", selected: false },
    { admissionNo: "120036", name: "Ayan Desai", fatherName: "Abhinand", dob: "10/15/2015", currentResult: "Pass", nextSessionStatus: "Continue", selected: false },
    { admissionNo: "96302", name: "Jacob Bethell", fatherName: "Brydon", dob: "08/19/2016", currentResult: "Pass", nextSessionStatus: "Continue", selected: false },
  ];

  // State for selection criteria
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // State for promotion criteria
  const [promoteSession, setPromoteSession] = useState("");
  const [promoteClass, setPromoteClass] = useState("");
  const [promoteSection, setPromoteSection] = useState("");

  // State for student list and table visibility
  const [students, setStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // State for popup notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Handle search button click
  const handleSearch = () => {
    if (selectedClass && selectedSection && promoteSession && promoteClass && promoteSection) {
      setShowTable(true);
      setStudents(studentData); // Load the student data
    } else {
      alert("Please select all criteria before searching.");
    }
  };

  // Handle student selection
  const handleStudentSelect = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].selected = !updatedStudents[index].selected;
    setStudents(updatedStudents);
  };

  // Handle current result change
  const handleCurrentResultChange = (index, result) => {
    const updatedStudents = [...students];
    updatedStudents[index].currentResult = result;
    setStudents(updatedStudents);
  };

  // Handle next session status change
  const handleNextSessionStatusChange = (index, status) => {
    const updatedStudents = [...students];
    updatedStudents[index].nextSessionStatus = status;
    setStudents(updatedStudents);
  };

  // Handle promote button click
  const handlePromote = () => {
    const selectedStudents = students.filter(student => student.selected);
    if (selectedStudents.length > 0) {
      const promotedStudentNames = selectedStudents.map(student => student.name).join(", ");
      setNotificationMessage(`Successfully promoted: ${promotedStudentNames}`);
      setShowNotification(true);

      // Reset the form and table
      setShowTable(false);
      setSelectedClass("");
      setSelectedSection("");
      setPromoteSession("");
      setPromoteClass("");
      setPromoteSection("");
      setStudents([]);
    } else {
      alert("Please select at least one student to promote.");
    }
  };

  // Automatically hide the notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="promote-student-container">
      <style>
        {`
          .promote-student-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg,rgb(237, 198, 100),rgb(20, 114, 244));
            min-height: 100vh;
            position: relative;
          }

          h2 {
            color:rgb(79, 81, 225);
            font-weight: bold;
            margin-bottom: 20px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .criteria-section, .promotion-section, .table-section {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            transition: transform 0.3s ease;
          }

          .criteria-section:hover, .promotion-section:hover, .table-section:hover {
            transform: translateY(-5px);
          }

          .criteria-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .promotion-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .criteria-section label, .promotion-section label {
            font-size: 16px;
            color: #34495e;
            margin-right: 10px;
            font-weight: 600;
          }

          .criteria-section select, .promotion-section select {
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 5px;
            transition: border-color 0.3s ease;
          }

          .criteria-section select:focus, .promotion-section select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .search-btn, .promote-btn {
            background: #3498db;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .search-btn:hover, .promote-btn:hover {
            background: #2980b9;
          }

          .table-section table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .table-section th, .table-section td {
            padding: 12px;
            text-align: center;
            font-size: 15px;
            border-bottom: 1px solid #ddd;
          }

          .table-section th {
            background: #3498db;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
          }

          .table-section tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .table-section tr:hover {
            background-color: #e9ecef;
          }

          .table-section input[type="checkbox"], .table-section input[type="radio"] {
            margin: 0 5px;
          }

          .table-section label {
            font-size: 14px;
            color: #34495e;
            margin: 0 5px;
          }

          .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.5s ease;
          }

          .notification.show {
            opacity: 1;
          }

          @media (max-width: 768px) {
            .criteria-section, .promotion-section {
              flex-direction: column;
              align-items: flex-start;
            }

            .criteria-section select, .promotion-section select {
              width: 100%;
              margin-bottom: 10px;
            }

            .search-btn, .promote-btn {
              width: 100%;
            }

            .table-section {
              overflow-x: auto;
            }
          }
        `}
      </style>

      {/* Select Criteria Section */}
      <h2>Select Criteria</h2>
      <div className="criteria-section">
        <div>
          <label>Class <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Section <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">Select</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Promote Students in Next Session Section */}
      <h2>Promote Students in Next Session</h2>
      <div className="promotion-section">
        <div>
          <label>Promote in Session <span style={{ color: 'red' }}>*</span></label>
          <select value={promoteSession} onChange={(e) => setPromoteSession(e.target.value)}>
            <option value="">Select</option>
            {sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Class <span style={{ color: 'red' }}>*</span></label>
          <select value={promoteClass} onChange={(e) => setPromoteClass(e.target.value)}>
            <option value="">Select</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Section <span style={{ color: 'red' }}>*</span></label>
          <select value={promoteSection} onChange={(e) => setPromoteSection(e.target.value)}>
            <option value="">Select</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {/* Student List Table */}
      {showTable && students.length > 0 && (
        <div className="table-section">
          <h2>Student List</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Admission No</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Date of Birth</th>
                <th>Current Result</th>
                <th>Next Session Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.selected}
                      onChange={() => handleStudentSelect(index)}
                    />
                  </td>
                  <td>{student.admissionNo}</td>
                  <td>{student.name}</td>
                  <td>{student.fatherName}</td>
                  <td>{student.dob}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`currentResult-${index}`}
                        checked={student.currentResult === "Pass"}
                        onChange={() => handleCurrentResultChange(index, "Pass")}
                      />
                      Pass
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`currentResult-${index}`}
                        checked={student.currentResult === "Fail"}
                        onChange={() => handleCurrentResultChange(index, "Fail")}
                      />
                      Fail
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`nextSessionStatus-${index}`}
                        checked={student.nextSessionStatus === "Continue"}
                        onChange={() => handleNextSessionStatusChange(index, "Continue")}
                      />
                      Continue
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`nextSessionStatus-${index}`}
                        checked={student.nextSessionStatus === "Leave"}
                        onChange={() => handleNextSessionStatusChange(index, "Leave")}
                      />
                      Leave
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="promote-btn" onClick={handlePromote}>Promote</button>
        </div>
      )}

      {/* Popup Notification */}
      {showNotification && (
        <div className={`notification ${showNotification ? 'show' : ''}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default PromoteStudents;