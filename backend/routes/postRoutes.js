const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
  getMyPosts,       // ✅ add
  deletePost        // ✅ add
} = require('../controllers/postController');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const router = express.Router();

// AWS S3 setup
aws.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'sodia-post-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = `${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// Routes
router.post('/', verifyToken, upload.single('image'), sharePost);
router.get('/', verifyToken, fetchFollowedPosts);
router.post('/:postId/like', verifyToken, like);
router.post('/:postId/reply', verifyToken, reply);

// ✅ ADD these routes:
router.get('/myposts', verifyToken, getMyPosts);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
