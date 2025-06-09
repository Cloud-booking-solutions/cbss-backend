const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const authMiddleware = require('../middleware/auth');

// @route   GET api/career
// @desc    Get all career items (courses)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Career.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/career/category/:category
// @desc    Get career items by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const careerItems = await Career.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(careerItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/career/:id
// @desc    Get career item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const careerItem = await Career.findById(req.params.id);
    
    if (!careerItem) {
      return res.status(404).json({ msg: 'Career item not found' });
    }
    
    res.json(careerItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Career item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/career
// @desc    Create a career item
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newCourse = new Career(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/career/:id
// @desc    Update a career item
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedCourse = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/career/:id
// @desc    Delete a career item
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCourse = await Career.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;