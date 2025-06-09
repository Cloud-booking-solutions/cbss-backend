const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');

// @route   GET api/blog
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/blog/published
// @desc    Get all published blogs
// @access  Public
router.get('/published', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blog/:id
// @desc    Get blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/blog
// @desc    Create a blog
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, image } = req.body;
    const newPost = new Blog({
      title,
      excerpt,
      content,
      image,
      status: 'Draft'
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/blog/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/blog/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;