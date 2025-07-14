const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/multer');
const {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
  getMyPosts,
  deletePost,
} = require('../controllers/postController');

router.use(verifyToken);

router.post('/', upload.single('image'), sharePost);
router.get('/feed', fetchFollowedPosts);
router.get('/myposts', getMyPosts);
router.delete('/:id', deletePost);
router.post('/:postId/like', like);
router.post('/:postId/reply', reply);

module.exports = router;
