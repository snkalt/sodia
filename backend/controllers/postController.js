// controllers/postController.js
const {
  createPost,
  getFollowedPosts,
  likePost,
  replyToPost,
} = require('../models/postModel');

const sharePost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const post = await createPost(userId, content);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Could not share post' });
  }
};

const fetchFollowedPosts = async (req, res) => {
  try {
    const posts = await getFollowedPosts(req.user.id);
    res.json(posts);
  } catch (err) {
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

module.exports = {
  sharePost,
  fetchFollowedPosts,
  like,
  reply,
};
