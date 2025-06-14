import React, { useState } from 'react';

const AssignClassTeacher = () => {
  // Sample data for classes, sections, and teachers
  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  const sections = ["A", "B", "D"];
  const teachers = [
    "Shivam Verma (9002)",
    "Jason Sharton (90006)",
    "Albert Thomas (54545454)",
  ];

  // State for form inputs
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [classError, setClassError] = useState("");
  const [sectionError, setSectionError] = useState("");

  // State for the class teacher list
  const [classTeachers, setClassTeachers] = useState([
    { class: "Class 1", section: "A", teacher: "Shivam Verma (9002)" },
    { class: "Class 2", section: "A", teacher: "Jason Sharton (90006)" },
    { class: "Class 3", section: "A", teacher: "Jason Sharton (90006)" },
    { class: "Class 4", section: "A", teacher: "Jason Sharton (90006)" },
    { class: "Class 4", section: "B", teacher: "Shivam Verma (9002)" },
    { class: "Class 5", section: "A", teacher: "Shivam Verma (9002)" },
    { class: "Class 5", section: "D", teacher: "Shivam Verma (9002)" },
  ]);

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!selectedClass) {
      setClassError("The Class field is required.");
      valid = false;
    } else {
      setClassError("");
    }

    if (!selectedSection) {
      setSectionError("The Section field is required.");
      valid = false;
    } else {
      setSectionError("");
    }

    if (valid && selectedTeacher) {
      setClassTeachers([
        ...classTeachers,
        { class: selectedClass, section: selectedSection, teacher: selectedTeacher },
      ]);
      setSelectedClass("");
      setSelectedSection("");
      setSelectedTeacher("");
    }
  };

  // Handle teacher checkbox selection
  const handleTeacherChange = (teacher) => {
    setSelectedTeacher(teacher === selectedTeacher ? "" : teacher);
  };

  // Handle delete
  const handleDelete = (index) => {
    setClassTeachers(classTeachers.filter((_, i) => i !== index));
  };

  // Handle edit (for simplicity, we'll just populate the form with the selected row's data)
  const handleEdit = (index) => {
    const teacher = classTeachers[index];
    setSelectedClass(teacher.class);
    setSelectedSection(teacher.section);
    setSelectedTeacher(teacher.teacher);
    handleDelete(index); // Remove the row so it can be re-added after editing
  };

  // Handle search
  const filteredTeachers = classTeachers.filter((teacher) =>
    teacher.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalRecords = filteredTeachers.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="assign-class-teacher-container">
      <style>
        {`
          .assign-class-teacher-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg,rgb(228, 178, 62), #cfdef3);
            min-height: 100vh;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }

          .form-section, .table-section {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .form-section {
            flex: 1;
            max-width: 400px;
          }

          .table-section {
            flex: 2;
          }

          .form-section:hover, .table-section:hover {
            transform: translateY(-5px);
          }

          h2 {
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .form-section label {
            display: block;
            font-size: 16px;
            color: #34495e;
            margin-bottom: 5px;
            font-weight: 600;
          }

          .form-section select {
            width: 100%;
            padding: 10px;
            margin-bottom: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-section select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .error {
            color: #e74c3c;
            font-size: 12px;
            margin-bottom: 10px;
          }

          .teacher-checkboxes {
            margin: 15px 0;
          }

          .teacher-checkboxes label {
            display: block;
            font-size: 14px;
            color: #34495e;
            margin-bottom: 5px;
          }

          .teacher-checkboxes input {
            margin-right: 5px;
          }

          .save-btn {
            background: linear-gradient(90deg, #3498db, #2980b9);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s ease, transform 0.1s ease;
          }

          .save-btn:hover {
            background: linear-gradient(90deg, #2980b9, #3498db);
            transform: scale(1.05);
          }

          .table-section .search-bar {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
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

          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            margin: 0 5px;
            font-size: 18px;
            transition: color 0.3s ease;
          }

          .edit-btn:hover {
            color: #3498db;
          }

          .delete-btn:hover {
            color: #e74c3c;
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 10px;
          }

          .pagination button {
            background: #3498db;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .pagination button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
          }

          .pagination button:hover:not(:disabled) {
            background: #2980b9;
          }

          @media (max-width: 768px) {
            .assign-class-teacher-container {
              flex-direction: column;
            }

            .form-section, .table-section {
              max-width: 100%;
            }
          }
        `}
      </style>

      {/* Form Section */}
      <div className="form-section">
        <h2>Assign Class Teacher</h2>
        <form onSubmit={handleSubmit}>
          <label>Class <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          {classError && <div className="error">{classError}</div>}

          <label>Section <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Select</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          {sectionError && <div className="error">{sectionError}</div>}

          <label>Class Teacher <span style={{ color: 'red' }}>*</span></label>
          <div className="teacher-checkboxes">
            {teachers.map((teacher) => (
              <label key={teacher}>
                <input
                  type="checkbox"
                  checked={selectedTeacher === teacher}
                  onChange={() => handleTeacherChange(teacher)}
                />
                {teacher}
              </label>
            ))}
          </div>

          <button type="submit" className="save-btn">Save</button>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <h2>Class Teacher List</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Class Teacher</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.class}</td>
                <td>{teacher.section}</td>
                <td>{teacher.teacher}</td>
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(startIndex + index)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(startIndex + index)}
                    title="Delete"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <p>Records: {startIndex + 1} to {Math.min(startIndex + recordsPerPage, totalRecords)} of {totalRecords}</p>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignClassTeacher;