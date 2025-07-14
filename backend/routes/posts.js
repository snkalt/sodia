// GET /api/posts/feed
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get users the current user follows
    const followQuery = `
      SELECT following_id FROM follows WHERE follower_id = $1
    `;
    const followsResult = await pool.query(followQuery, [currentUserId]);

    // Flatten list of IDs
    const followingIds = followsResult.rows.map(row => row.following_id);
    followingIds.push(currentUserId); // include own posts

    console.log('Feed user IDs:', followingIds); // Debug

    if (followingIds.length === 0) {
      return res.json([]);
    }

    // Fetch posts
    const postQuery = `
      SELECT posts.*, users.username 
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE user_id = ANY($1::int[])
      ORDER BY posts.created_at DESC
    `;
    const postsResult = await pool.query(postQuery, [followingIds]); // flat array

    res.json(postsResult.rows);
  } catch (err) {
    console.error('Feed error:', err.message);
    res.status(500).send('Server error');
  }
});
