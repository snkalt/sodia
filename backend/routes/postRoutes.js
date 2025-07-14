const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
} = require('../controllers/postController');

const db = require('../db'); // your database module with query method

const router = express.Router();

router.post('/', verifyToken, sharePost); // Share new post
router.get('/', verifyToken, fetchFollowedPosts); // View followed posts
router.post('/:postId/like', verifyToken, like); // Like post
router.post('/:postId/reply', verifyToken, reply); // Reply to post

// NEW ROUTE - GET /api/posts/mine - fetch posts by logged in user
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, content, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'Failed to fetch your posts' });
  }
});

// NEW ROUTE - DELETE /api/posts/:postId - delete post by logged-in user
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    // Check ownership
    const check = await db.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (check.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete post
    await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
