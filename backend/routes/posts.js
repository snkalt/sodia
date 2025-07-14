const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const pool = require('../db'); // Your pg Pool instance or db module

router.use(verifyToken);

router.get('/feed', async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get the list of users current user follows
    const followQuery = `
      SELECT following_id FROM follows WHERE follower_id = $1
    `;
    const followsResult = await pool.query(followQuery, [currentUserId]);

    const followingIds = followsResult.rows.map(row => row.following_id);

    // Include current user's own ID to get their posts too
    followingIds.push(currentUserId);

    // If no following IDs (somehow), send empty array
    if (followingIds.length === 0) return res.json([]);

    // Fetch posts for all those users ordered by newest first
    const postQuery = `
      SELECT posts.id, posts.content, posts.user_id, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ANY($1::int[])
      ORDER BY posts.created_at DESC
    `;

    const postsResult = await pool.query(postQuery, [followingIds]);

    res.json(postsResult.rows);
  } catch (error) {
    console.error('Error fetching feed:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
