const mongoose = require('mongoose');

const subjectGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  classes: [
    {
      class: String,
      section: String,
      subjects: [String]
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('SubjectGroup', subjectGroupSchema);
