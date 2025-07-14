import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostBox() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem('token');

  const sharePost = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        'http://localhost:5001/api/posts',
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setContent('');
      fetchPosts(); // Refresh post list
    } catch (err) {
      console.error('Post failed:', err);
      alert('Failed to post. Please log in again.');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('ERROR fetching posts:', err);
      alert('Failed to load posts. You may not be authorized.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <textarea
        rows="3"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's happening?"
        style={{ width: '100%' }}
      />
      <button
        onClick={sharePost}
        style={{ background: 'green', color: 'white', marginTop: '10px' }}
      >
        Share
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h3>Posts from people you follow:</h3>
        {posts.map(post => (
          <div
            key={post.id}
            style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}
          >
            <strong>@{post.username}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
