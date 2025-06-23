const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Multer instance for image/video uploads (200MB limit)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
  }
});

// File filter for resumes (PDF only)
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed for resumes.'), false);
  }
};

// Multer instance for resume uploads (2MB limit)
const resumeUpload = multer({
  storage: storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// ✅ Correct unified export
module.exports = {
  upload,
  resumeUpload
};
