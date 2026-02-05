// middleware/uploadChecklist.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    // Custom filenames based on field
    if (/^attachments\[\d+\]$/.test(file.fieldname)) {
      // Example: D-DOOR-01-1685991234567-fix1.png
      cb(null, `${base}-${timestamp}${ext}`);
    } else if (file.fieldname === 'videoUpload') {
      // Example: video-1685991234567.mp4
      cb(null, `video-${timestamp}${ext}`);
    } else {
      cb(null, `file-${timestamp}${ext}`);
    }
  }
});

// File filter
const fileFilter = (req, file, cb) => {

  console.log("Processing file:", file.fieldname, file.originalname);
  console.log("MIME type:", file.mimetype);

  // Accept ANY attachments[...] field (with any string inside brackets)
  if (/^attachments\[[^\]]+\]$/.test(file.fieldname)) {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    } else {
      return cb(new Error("Only image files allowed for attachments"), false);
    }
  }

  // Accept video field
  if (file.fieldname === "videoUpload") {
    if (file.mimetype.startsWith("video/")) {
      return cb(null, true);
    } else {
      return cb(new Error("Only video files allowed"), false);
    }
  }

  console.log("Unknown field detected:", file.fieldname);
  return cb(new Error("Unexpected file field"), false);
};


// Export middleware
module.exports = multer({ storage, fileFilter }).any(); // Accepts all fields
