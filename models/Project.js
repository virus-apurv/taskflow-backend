const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Project name is required'], trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  color: { type: String, default: '#6366f1' },
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
