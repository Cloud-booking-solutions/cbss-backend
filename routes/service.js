const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

// @route   GET api/service
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/service/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/service
// @desc    Create a service
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let features = [];
    if (req.body.features) {
      if (typeof req.body.features === 'string') {
        features = JSON.parse(req.body.features);
      } else {
        features = req.body.features;
      }
    }
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const newService = new Service({
      title,
      description,
      features,
      image,
      category
    });
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/service/:id
// @desc    Update a service
// @access  Private
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    const { title, description, category } = req.body;
    let features = [];
    if (req.body.features) {
      if (typeof req.body.features === 'string') {
        features = JSON.parse(req.body.features);
      } else {
        features = req.body.features;
      }
    }
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    if (title) service.title = title;
    if (description) service.description = description;
    if (features) service.features = features;
    if (image) service.image = image;
    if (category) service.category = category;
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/service/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
if (!service) {
  return res.status(404).json({ message: 'Service not found' });
}
// No need to call remove(), it's already deleted
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;