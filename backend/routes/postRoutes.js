// routes/postRoutes.js
const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
} = require('../controllers/postController');

const router = express.Router();

router.post('/', verifyToken, sharePost); // Share new post
router.get('/', verifyToken, fetchFollowedPosts); // View followed posts
router.post('/:postId/like', verifyToken, like); // Like post
router.post('/:postId/reply', verifyToken, reply); // Reply to post

module.exports = router;
