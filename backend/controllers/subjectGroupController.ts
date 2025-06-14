const SubjectGroup = require('../models/SubjectGroup.ts'); // Remove .ts extension

// Create a new subject group
const createSubjectGroup = async (req, res) => {
  try {
    const { name, classData } = req.body;
    const newSubjectGroup = new SubjectGroup({
      name,
      classes: [
        {
          class: classData.class,
          section: classData.section,
          subjects: classData.subjects
        }
      ]
    });

    await newSubjectGroup.save();
    res.status(201).json(newSubjectGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all subject groups
const getSubjectGroups = async (req, res) => {
  try {
    const subjectGroups = await SubjectGroup.find();
    res.status(200).json(subjectGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single subject group by ID
const getSubjectGroupById = async (req, res) => {
  try {
    const subjectGroup = await SubjectGroup.findById(req.params.id);
    if (!subjectGroup) {
      return res.status(404).json({ message: "Subject group not found" });
    }
    res.status(200).json(subjectGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subject group
const updateSubjectGroup = async (req, res) => {
  try {
    const updatedSubjectGroup = await SubjectGroup.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.status(200).json(updatedSubjectGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a subject group
const deleteSubjectGroup = async (req, res) => {
  try {
    await SubjectGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Subject group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubjectGroup,
  getSubjectGroups,
  getSubjectGroupById,  // corrected function name here too
  updateSubjectGroup,
  deleteSubjectGroup,
};
