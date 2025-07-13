const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/authMiddleware');

// 🔍 SEARCH USERS (excluding self)
router.get('/search', authenticate, async (req, res) => {
  const query = req.query.query?.toLowerCase();
  const currentUserId = req.user.id;

  if (!query) return res.json([]);

  try {
    const usersResult = await pool.query(
      `SELECT id, username FROM users
       WHERE LOWER(username) LIKE $1 AND id != $2
       ORDER BY username ASC`,
      [`%${query}%`, currentUserId]
    );

    const followResult = await pool.query(
      `SELECT following_id FROM follows WHERE follower_id = $1`,
      [currentUserId]
    );

    const followingIds = followResult.rows.map(row => row.following_id);

    const users = usersResult.rows.map(user => ({
      ...user,
      isFollowing: followingIds.includes(user.id),
    }));

    res.json(users);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ➕ FOLLOW USER
router.post('/follow/:id', authenticate, async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  try {
    await pool.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [followerId, followingId]
    );
    res.json({ message: 'Followed successfully' });
  } catch (err) {
    console.error('Follow failed:', err);
    res.status(500).json({ error: 'Follow failed' });
  }
});

// ❌ UNFOLLOW USER
router.delete('/follow/:id', authenticate, async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  try {
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error('Unfollow failed:', err);
    res.status(500).json({ error: 'Unfollow failed' });
  }
});

module.exports = router;


// 🧑‍🤝‍🧑 GET MY FOLLOWERS
router.get('/followers', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username
       FROM follows
       JOIN users ON follows.follower_id = users.id
       WHERE follows.following_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching followers:', err);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// 🧑‍🤝‍🧑 GET WHO I FOLLOW
router.get('/following', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username
       FROM follows
       JOIN users ON follows.following_id = users.id
       WHERE follows.follower_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching following:', err);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});



// GET USER PROFILE + POSTS
router.get('/profile/:id', authenticate, async (req, res) => {
  const targetId = parseInt(req.params.id);
  const currentUserId = req.user.id;

  try {
    const userRes = await pool.query('SELECT id, username FROM users WHERE id = $1', [targetId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const postRes = await pool.query(
      `SELECT p.id, p.content, p.created_at, u.username
       FROM posts p JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1 ORDER BY p.created_at DESC`,
      [targetId]
    );

    const followRes = await pool.query(
      `SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [currentUserId, targetId]
    );

    res.json({
      user: userRes.rows[0],
      posts: postRes.rows,
      isFollowing: followRes.rowCount > 0,
    });
  } catch (err) {
    console.error('Error loading user profile:', err);
    res.status(500).json({ error: 'Failed to load user profile' });
  }
});

// REMOVE A FOLLOWER
router.delete('/remove-follower/:id', authenticate, async (req, res) => {
  const currentUserId = req.user.id; // You are being followed
  const followerId = parseInt(req.params.id); // They are following you

  try {
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [followerId, currentUserId]
    );
    res.json({ message: 'Follower removed' });
  } catch (err) {
    console.error('Error removing follower:', err);
    res.status(500).json({ error: 'Failed to remove follower' });
  }
});





// GET logged-in user's profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const userRes = await pool.query(
      'SELECT id, username, gender, dob, phone, email FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userRes.rows[0]);
  } catch (err) {
    console.error('Error fetching logged-in user profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});
