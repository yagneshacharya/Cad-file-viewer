const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../controllers/fileUpload.controller');
const { getAllBlocks,getBlockById,searchBlocks } = require('../controllers/getBlocks.controller');
const multer = require('multer');
const path = require('path');

// Setup Multer again if not already
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), handleFileUpload);
router.get('/blocks', getAllBlocks);
router.get('/blocks/:id', getBlockById);
router.get('/sblocks', searchBlocks);
module.exports = router;
