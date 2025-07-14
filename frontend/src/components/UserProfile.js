import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5001/api/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error('Profile fetch failed', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5001/api/users/follow/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5001/api/users/follow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow toggle failed', err);
      alert('Failed to update follow status.');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
        <button style={styles.button} onClick={fetchProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{user.username}</h2>
      <button
        onClick={handleFollowToggle}
        style={{
          ...styles.button,
          backgroundColor: isFollowing ? '#999' : '#28a745',
          marginBottom: '1.5rem',
        }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>

      <h3 style={styles.subTitle}>Posts</h3>
      {posts.length === 0 ? (
        <p style={styles.noPosts}>No posts yet.</p>
      ) : (
        posts.map((post) => {
          const date = new Date(post.created_at);
          const formattedDate = date.toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

          return (
            <div key={post.id} style={styles.postCard}>
              <p style={styles.timestamp}>{formattedDate}</p>
              <p style={styles.postContent}>{post.content}</p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="shared"
                  style={{ width: '100%', borderRadius: '6px', marginTop: '10px' }}
                />
              )}
            </div>
          );
        })
      )}

      <button style={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#333',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  subTitle: {
    color: '#555',
    marginBottom: '1rem',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  postCard: {
    backgroundColor: '#fafafa',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
  },
  postContent: {
    whiteSpace: 'pre-wrap',
    fontSize: '1rem',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  noPosts: {
    fontStyle: 'italic',
    color: '#777',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  backButton: {
    marginTop: '2rem',
    display: 'block',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
};
