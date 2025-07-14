import React, { useState } from 'react';
import axios from 'axios';

export default function FriendSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  const searchUsers = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5001/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleFollow = async (id, follow) => {
    try {
      if (follow) {
        await axios.delete(`http://localhost:5001/api/users/follow/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/users/follow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      searchUsers(); // Refresh list
    } catch (err) {
      console.error('Follow/unfollow failed', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>🔍 Search & Follow Friends</h3>
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: '8px', width: '60%' }}
      />
      <button onClick={searchUsers} style={{ padding: '8px 16px', marginLeft: '10px' }}>
        Search
      </button>

      <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1rem' }}>
        {results.map(user => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <strong>{user.username}</strong>
            <button
              onClick={() => handleFollow(user.id, user.isFollowing)}
              style={{
                marginLeft: '20px',
                padding: '5px 10px',
                backgroundColor: user.isFollowing ? '#ccc' : 'green',
                color: 'white',
                border: 'none'
              }}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
