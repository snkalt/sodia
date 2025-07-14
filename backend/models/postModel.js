const pool = require('../db');

const createPost = async (userId, content, imageUrl = null) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, content, image_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, content, imageUrl]
  );
  return result.rows[0];
};

const getFollowedPosts = async (userId) => {
  const follows = await pool.query(
    `SELECT following_id FROM follows WHERE follower_id = $1`,
    [userId]
  );
  const ids = follows.rows.map(row => row.following_id);
  ids.push(userId); // include own posts

  const posts = await pool.query(
    `SELECT posts.*, users.username FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.user_id = ANY($1::int[])
     ORDER BY posts.created_at DESC`,
    [ids]
  );
  return posts.rows;
};

const likePost = async (userId, postId) => {
  const result = await pool.query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

const replyToPost = async (userId, postId, content) => {
  const result = await pool.query(
    `INSERT INTO replies (user_id, post_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, postId, content]
  );
  return result.rows[0];
};

module.exports = {
  createPost,
  getFollowedPosts,
  likePost,
  replyToPost,
};
