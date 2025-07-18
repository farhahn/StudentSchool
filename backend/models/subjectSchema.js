// backend/models/subjectSchema.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, required: true, enum: ['Theory', 'Practical'], default: 'Theory' },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Optional
  sessions: { type: Number, default: 0 }, // Added for dashboard compatibility
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);