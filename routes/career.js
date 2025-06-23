const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const authMiddleware = require('../middleware/auth');
const nodemailer = require('nodemailer');
const { resumeUpload } = require('../config/upload');
const fs = require('fs');

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

// POST /api/career/apply - Job application form submission
router.post('/apply', resumeUpload.single('resume'), async (req, res) => {
  try {
    const { name, mobile, email, qualification, experience, degree, location } = req.body;
    if (!name || !mobile || !email || !qualification || !experience || !degree || !location || !req.file) {
      return res.status(400).json({ message: 'All fields are required and resume must be uploaded.' });
    }
    // Validate file type and size (already handled by multer)

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Application Received',
      text: `A new job application has been submitted.\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nQualification: ${qualification}\nExperience: ${experience}\nDegree: ${degree}\nLocation: ${location}`,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optionally, delete the file after sending
    fs.unlink(req.file.path, () => {});

    res.status(200).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

module.exports = router;