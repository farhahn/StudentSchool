import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GroupExam = () => {
  const navigate = useNavigate();

  // Sample Exam Groups Data
  const [examGroups, setExamGroups] = useState([
    { id: 1, name: "Class 4 (Pass/Fail)", exams: 12, type: "General Purpose (Pass/Fail)", description: "Basic pass/fail system" },
    { id: 2, name: "Class 4 (School Based Grading System)", exams: 13, type: "School Based Grading System", description: "Standard school grading" },
    { id: 3, name: "Class 4 (College Based Grading System)", exams: 8, type: "College Based Grading System", description: "University grading system" },
    { id: 4, name: "Class 4 (GPA Grading System)", exams: 11, type: "GPA Grading System", description: "Grade Point Average system" },
    { id: 5, name: "Average Passing Exam", exams: 8, type: "Average Passing", description: "Minimum passing requirement" },
  ]);

  const examTypes = ["General Purpose (Pass/Fail)", "School Based Grading System", "College Based Grading System", "GPA Grading System", "Average Passing"];

  // Form Handling
  const [formData, setFormData] = useState({ name: "", type: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setExamGroups(
        examGroups.map((group) =>
          group.id === editId ? { ...group, ...formData } : group
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newGroup = { id: examGroups.length + 1, ...formData, exams: 0 };
      setExamGroups([...examGroups, newGroup]);
    }
    setFormData({ name: "", type: "", description: "" });
  };

  const handleEdit = (id) => {
    const selectedGroup = examGroups.find((group) => group.id === id);
    setFormData({ name: selectedGroup.name, type: selectedGroup.type, description: selectedGroup.description });
    setIsEditing(true);
    setEditId(id);
  };

  const handleNavigateToAddExam = () => {
    navigate("/add-exam");
  };

  return (
    <div style={styles.container}>
      {/* Add/Edit Exam Group Section */}
      <div style={styles.formSection}>
        <h2 style={styles.heading}>{isEditing ? "Edit Exam Group" : "Add Exam Group"}</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />

          <label style={styles.label}>Exam Type *</label>
          <select name="type" value={formData.type} onChange={handleChange} style={styles.input} required>
            <option value="">Select</option>
            {examTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label style={styles.label}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textarea}></textarea>

          <button type="submit" style={styles.button}>
            <FaPlus style={{ marginRight: "5px" }} /> {isEditing ? "Update" : "Add"} Exam Group
          </button>
        </form>
      </div>

      {/* Add Examination Name Button */}
      <div style={styles.topBar}>
        <button style={styles.addExamButton} onClick={handleNavigateToAddExam}>
          <FaPlus style={{ marginRight: "5px" }} /> Add Examination Name
        </button>
      </div>

      {/* Exam Group List Section */}
      <div style={styles.listSection}>
        <h2 style={styles.heading}>Exam Group List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>No. of Exams</th>
              <th>Exam Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examGroups.map((group) => (
              <tr key={group.id}>
                <td><FaBookOpen style={{ marginRight: "5px" }} /> {group.name}</td>
                <td>{group.exams}</td>
                <td>{group.type}</td>
                <td>{group.description}</td>
                <td>
                  <button style={styles.editButton} onClick={() => handleEdit(group.id)}>
                    <FaEdit style={{ marginRight: "5px" }} /> Edit
                  </button>
                  <button style={styles.deleteButton}>
                    <FaTrash style={{ marginRight: "5px" }} /> Delete
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

// Internal CSS Styles
const styles = {
  container: { padding: "20px" },
  formSection: { backgroundColor: "#d3e0ff", padding: "15px", borderRadius: "5px", marginBottom: "20px" },
  heading: { fontSize: "18px", marginBottom: "10px" },
  label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
  input: { padding: "8px", width: "100%", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" },
  textarea: { padding: "8px", width: "100%", height: "60px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" },
  button: { backgroundColor: "#28a745", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" },
  topBar: { display: "flex", justifyContent: "flex-end", marginBottom: "10px" },
  addExamButton: { backgroundColor: "#007bff", color: "#fff", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" },
  listSection: { padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#87abed" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  editButton: { backgroundColor: "#ffc107", color: "#000", border: "none", padding: "5px 10px", cursor: "pointer", marginRight: "5px", display: "flex", alignItems: "center" },
  deleteButton: { backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
};

export default GroupExam;
