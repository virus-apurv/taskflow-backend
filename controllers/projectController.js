const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const projectsWithCount = await Promise.all(projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ project: p._id });
      const doneCount = await Task.countDocuments({ project: p._id, status: 'done' });
      return { ...p.toObject(), taskCount, doneCount };
    }));
    res.json(projectsWithCount);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createProject = async (req, res) => {
  try {
    const { name, description, color, deadline } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });
    const project = await Project.create({ name, description, color, deadline, owner: req.user._id });
    res.status(201).json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject };
