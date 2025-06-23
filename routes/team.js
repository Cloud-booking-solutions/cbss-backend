const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

// @route   GET api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/team
// @desc    Create a team member
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { name, role, type } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    // Create new team member
    const newTeamMember = new Team({
      name,
      role,
      image,
      type
    });
    const teamMember = await newTeamMember.save();
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/team/:id
// @desc    Update a team member
// @access  Private
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    // Update fields
    const { name, role, type } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    if (name) teamMember.name = name;
    if (role) teamMember.role = role;
    if (image) teamMember.image = image;
    if (type) teamMember.type = type;
    await teamMember.save();
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/team/:id
// @desc    Delete a team member
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    
    await teamMember.deleteOne();
    res.json({ msg: 'Team member removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;