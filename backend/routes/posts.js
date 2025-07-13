// /routes/posts.js
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT posts.*, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id IN (
        SELECT following_id FROM follows WHERE follower_id = $1
      )
      ORDER BY posts.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts from followed users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
