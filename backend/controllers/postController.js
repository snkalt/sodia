const pool = require('../db');
const { createPost, getFollowedPosts, likePost, replyToPost } = require('../models/postModel');

const sharePost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.location; // from S3 upload
    }

    const post = await createPost(userId, content, imageUrl);
    res.status(201).json(post);
  } catch (err) {
    console.error('Error sharing post:', err);
    res.status(500).json({ error: 'Could not share post' });
  }
};

const fetchFollowedPosts = async (req, res) => {
  try {
    const posts = await getFollowedPosts(req.user.id);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).json({ error: 'Could not fetch posts' });
  }
};

const like = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await likePost(req.user.id, postId);
    res.json({ message: result ? 'Liked' : 'Already liked' });
  } catch (err) {
    res.status(500).json({ error: 'Like failed' });
  }
};

const reply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const reply = await replyToPost(req.user.id, postId, content);
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: 'Reply failed' });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT id, content, image_url, created_at
      FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching my posts:', err);
    res.status(500).json({ error: 'Could not fetch user posts' });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const checkQuery = 'SELECT * FROM posts WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [postId, userId]);

    if (checkResult.rowCount === 0) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    const deleteQuery = 'DELETE FROM posts WHERE id = $1';
    await pool.query(deleteQuery, [postId]);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Could not delete post' });
  }
};

module.exports = {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
  getMyPosts,
  deletePost,
};
