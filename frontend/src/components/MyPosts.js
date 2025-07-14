import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchMyPosts();
    }
  }, [token]);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts/myposts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch my posts:', err);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMyPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={styles.heading}>My Posts</h2>
      </div>

      <div style={styles.card}>
        {posts.length === 0 ? (
          <p>No posts found.</p>
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
                <button
                  onClick={() => deletePost(post.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
                <p style={styles.timestamp}>{formattedDate}</p>
                <p style={styles.postContent}>{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    style={styles.postImage}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    minHeight: '100vh',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    color: '#333',
    backgroundColor: '#ffffffcc',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  postCard: {
    position: 'relative',
    backgroundColor: '#fafafa',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  postContent: {
    marginBottom: '0.5rem',
    whiteSpace: 'pre-wrap',
  },
  postImage: {
    width: '100%',
    borderRadius: '6px',
    marginTop: '10px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
};
