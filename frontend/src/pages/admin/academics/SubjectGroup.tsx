import React, { useState } from 'react';

const SubjectGroup = () => {
  // Sample data for classes, sections, and subjects
  const classes = ["Class 1", "Class 2", "Class 3", "Class 4"];
  const sections = ["A", "B", "C", "D"];
  const subjects = [
    "English", "Hindi", "Mathematics", "Science", "Social Studies",
    "French", "Drawing", "Computer", "Elective 1", "Elective 2", "Elective 3"
  ];

  // State for form inputs
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // State for subject groups
  const [subjectGroups, setSubjectGroups] = useState([
    {
      name: "Class 1st SUB Group",
      classes: [
        { class: "Class 1", section: "A", subjects: ["English"] },
        { class: "Class 1", section: "B", subjects: ["Hindi"] },
        { class: "Class 1", section: "C", subjects: ["Mathematics"] },
        { class: "Class 1", section: "D", subjects: ["Science", "Drawing", "Computer", "Elective 1"] },
      ],
    },
    {
      name: "Class 2nd SUB Group",
      classes: [
        { class: "Class 2", section: "A", subjects: ["English"] },
        { class: "Class 2", section: "B", subjects: ["Hindi"] },
        { class: "Class 2", section: "C", subjects: ["Mathematics"] },
        { class: "Class 2", section: "D", subjects: ["Science", "French", "Drawing", "Computer", "Elective 1"] },
      ],
    },
    {
      name: "Class 3rd SUB Group",
      classes: [
        { class: "Class 3", section: "A", subjects: ["English"] },
        { class: "Class 3", section: "B", subjects: ["Hindi"] },
        { class: "Class 3", section: "C", subjects: ["Mathematics"] },
        { class: "Class 3", section: "D", subjects: ["Science", "Social Studies", "Computer", "Elective 1", "Elective 2"] },
      ],
    },
    {
      name: "Class 4th SUB Group",
      classes: [
        { class: "Class 4", section: "A", subjects: ["English"] },
        { class: "Class 4", section: "B", subjects: ["Hindi"] },
        { class: "Class 4", section: "C", subjects: ["Mathematics"] },
        { class: "Class 4", section: "D", subjects: ["Science", "Social Studies", "Computer", "Elective 1"] },
      ],
    },
  ]);

  // Handle subject checkbox selection
  const handleSubjectChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedClass && selectedSection && selectedSubjects.length > 0) {
      const existingGroup = subjectGroups.find(group => group.name === name);
      if (existingGroup) {
        // Update existing group
        const updatedGroups = subjectGroups.map(group => {
          if (group.name === name) {
            return {
              ...group,
              classes: [
                ...group.classes,
                { class: selectedClass, section: selectedSection, subjects: selectedSubjects },
              ],
            };
          }
          return group;
        });
        setSubjectGroups(updatedGroups);
      } else {
        // Add new group
        setSubjectGroups([
          ...subjectGroups,
          {
            name,
            classes: [{ class: selectedClass, section: selectedSection, subjects: selectedSubjects }],
          },
        ]);
      }
      // Reset form
      setName("");
      setSelectedClass("");
      setSelectedSection("");
      setSelectedSubjects([]);
    } else {
      alert("Please fill in all required fields and select at least one subject.");
    }
  };

  // Handle edit
  const handleEdit = (groupIndex, classIndex) => {
    const group = subjectGroups[groupIndex];
    const classData = group.classes[classIndex];
    setName(group.name);
    setSelectedClass(classData.class);
    setSelectedSection(classData.section);
    setSelectedSubjects(classData.subjects);
    // Remove the class entry so it can be re-added after editing
    handleDelete(groupIndex, classIndex);
  };

  // Handle delete
  const handleDelete = (groupIndex, classIndex) => {
    const updatedGroups = [...subjectGroups];
    updatedGroups[groupIndex].classes.splice(classIndex, 1);
    if (updatedGroups[groupIndex].classes.length === 0) {
      updatedGroups.splice(groupIndex, 1); // Remove the group if no classes remain
    }
    setSubjectGroups(updatedGroups);
  };

  return (
    <div className="add-subject-group-container">
      <style>
        {`
          .add-subject-group-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg,rgb(225, 192, 69), #cfdef3);
            min-height: 100vh;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }

          .form-section, .list-section {
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

          .list-section {
            flex: 2;
            overflow-y: auto;
            max-height: 80vh;
          }

          .form-section:hover, .list-section:hover {
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

          .form-section input[type="text"],
          .form-section select {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-section input[type="text"]:focus,
          .form-section select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .subject-checkboxes {
            margin: 15px 0;
            max-height: 200px;
            overflow-y: auto;
          }

          .subject-checkboxes label {
            display: block;
            font-size: 14px;
            color: #34495e;
            margin-bottom: 5px;
          }

          .subject-checkboxes input {
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

          .list-section .group {
            margin-bottom: 20px;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          .list-section .group:last-child {
            border-bottom: none;
          }

          .list-section .group h3 {
            color: #2c3e50;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .list-section .class-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
          }

          .list-section .class-entry span {
            font-size: 14px;
            color: #34495e;
          }

          .list-section .subjects {
            margin-left: 20px;
            font-size: 14px;
            color: #7f8c8d;
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

          @media (max-width: 768px) {
            .add-subject-group-container {
              flex-direction: column;
            }

            .form-section, .list-section {
              max-width: 100%;
            }

            .list-section {
              max-height: none;
            }
          }
        `}
      </style>

      {/* Form Section */}
      <div className="form-section">
        <h2>Add Subject Group</h2>
        <form onSubmit={handleSubmit}>
          <label>Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
          />

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

          <label>Subject <span style={{ color: 'red' }}>*</span></label>
          <div className="subject-checkboxes">
            {subjects.map((subject) => (
              <label key={subject}>
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                />
                {subject}
              </label>
            ))}
          </div>

          <button type="submit" className="save-btn">Save</button>
        </form>
      </div>

      {/* Subject Group List Section */}
      <div className="list-section">
        <h2>Subject Group List</h2>
        {subjectGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="group">
            <h3>{group.name}</h3>
            {group.classes.map((classData, classIndex) => (
              <div key={classIndex} className="class-entry">
                <div>
                  <span>Class (Section): {classData.class} ({classData.section})</span>
                  <div className="subjects">
                    {classData.subjects.map((subject, subjectIndex) => (
                      <span key={subjectIndex}>
                        {subjectIndex + 1}. {subject}
                        {subjectIndex < classData.subjects.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(groupIndex, classIndex)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(groupIndex, classIndex)}
                    title="Delete"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGroup;