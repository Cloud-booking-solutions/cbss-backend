const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// @route   GET api/gallery/images
// @desc    Get all images
// @access  Public
router.get('/images', async (req, res) => {
  try {
    console.log('Fetching all images');
    const items = await Gallery.find({ type: 'image' }).sort({ createdAt: -1 });
    console.log('Found images:', items);
    res.json(items);
  } catch (error) {
    console.error('Error in GET /api/gallery/images:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/gallery/videos
// @desc    Get all videos
// @access  Public
router.get('/videos', async (req, res) => {
  try {
    console.log('Fetching all videos');
    const items = await Gallery.find({ type: 'video' }).sort({ createdAt: -1 });
    console.log('Found videos:', items);
    res.json(items);
  } catch (error) {
    console.error('Error in GET /api/gallery/videos:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/gallery/events
// @desc    Get all events
// @access  Public
router.get('/events', async (req, res) => {
  try {
    console.log('Fetching all events');
    const items = await Gallery.find({ type: 'event' }).sort({ createdAt: -1 });
    console.log('Found events:', items);
    res.json(items);
  } catch (error) {
    console.error('Error in GET /api/gallery/events:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/gallery/type/:type
// @desc    Get gallery items by type (photo, video, event)
// @access  Public
router.get('/type/:type', async (req, res) => {
  try {
    const galleryItems = await Gallery.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gallery/category/:category
// @desc    Get gallery items by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const galleryItems = await Gallery.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gallery/:id
// @desc    Get gallery item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/gallery/images
// @desc    Create an image item
// @access  Private
router.post('/images', auth, async (req, res) => {
  try {
    console.log('Received new image request:', req.body);
    const { title, description, imageUrl } = req.body;

    // Validate required fields
    if (!title || !description || !imageUrl) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { title, description, imageUrl }
      });
    }

    const newItem = new Gallery({
      title,
      description,
      imageUrl,
      type: 'image'
    });

    console.log('Created new image:', newItem);
    const savedItem = await newItem.save();
    console.log('Saved image:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error in POST /api/gallery/images:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST api/gallery/videos
// @desc    Create a video item
// @access  Private
router.post('/videos', auth, async (req, res) => {
  try {
    console.log('Received new video request:', req.body);
    const { title, description, videoUrl } = req.body;

    // Validate required fields
    if (!title || !description || !videoUrl) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { title, description, videoUrl }
      });
    }

    const newItem = new Gallery({
      title,
      description,
      videoUrl,
      type: 'video'
    });

    console.log('Created new video:', newItem);
    const savedItem = await newItem.save();
    console.log('Saved video:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error in POST /api/gallery/videos:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST api/gallery/events
// @desc    Create an event item
// @access  Private
router.post('/events', auth, async (req, res) => {
  try {
    console.log('Received new event request:', req.body);
    const { title, description, imageUrl } = req.body;

    // Validate required fields
    if (!title || !description || !imageUrl) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { title, description, imageUrl }
      });
    }

    const newItem = new Gallery({
      title,
      description,
      imageUrl,
      type: 'event'
    });

    console.log('Created new event:', newItem);
    const savedItem = await newItem.save();
    console.log('Saved event:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error in POST /api/gallery/events:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/gallery/images/:id
// @desc    Delete an image
// @access  Private
router.delete('/images/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete image:', req.params.id);
    const item = await Gallery.findOne({ _id: req.params.id, type: 'image' });
    if (!item) {
      console.log('Image not found:', req.params.id);
      return res.status(404).json({ message: 'Image not found' });
    }
    await item.deleteOne();
    console.log('Image deleted successfully:', req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error in DELETE /api/gallery/images/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/gallery/videos/:id
// @desc    Delete a video
// @access  Private
router.delete('/videos/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete video:', req.params.id);
    const item = await Gallery.findOne({ _id: req.params.id, type: 'video' });
    if (!item) {
      console.log('Video not found:', req.params.id);
      return res.status(404).json({ message: 'Video not found' });
    }
    await item.deleteOne();
    console.log('Video deleted successfully:', req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    console.error('Error in DELETE /api/gallery/videos/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/gallery/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/events/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete event:', req.params.id);
    const item = await Gallery.findOne({ _id: req.params.id, type: 'event' });
    if (!item) {
      console.log('Event not found:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }
    await item.deleteOne();
    console.log('Event deleted successfully:', req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error in DELETE /api/gallery/events/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;