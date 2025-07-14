import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const sharePost = async () => {
    if (!content.trim()) return;
    try {
      await axios.post('http://localhost:5001/api/posts', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const searchUsers = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5001/api/users/search?query=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleFollow = async (id, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5001/api/users/follow/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/users/follow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      searchUsers(); // Refresh search result
    } catch (err) {
      console.error('Follow/unfollow failed', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      {/* 🔍 Search Users Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>🔍 Search & Follow Friends</h3>
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchUsers();
          }}
          style={{ padding: '8px', width: '80%' }}
        />
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '10px' }}>
          {searchResults.map(user => (
            <li key={user.id} style={{ marginBottom: '8px' }}>
              <strong>{user.username}</strong>
              <button
                onClick={() => handleFollow(user.id, user.isFollowing)}
                style={{
                  marginLeft: '20px',
                  padding: '5px 10px',
                  backgroundColor: user.isFollowing ? '#999' : 'green',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ✍️ Post Sharing Section */}
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', height: '80px', padding: '10px' }}
      />
      <button onClick={sharePost} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', marginTop: '10px' }}>
        Share
      </button>

      {/* 📰 Posts Feed */}
      <div style={{ marginTop: '2rem' }}>
        <h3>📰 Posts from People You Follow</h3>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>{post.username}</strong></p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
