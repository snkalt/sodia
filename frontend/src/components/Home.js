import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUser();
      fetchFeedPosts();
    }
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const fetchFeedPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await axios.get('http://localhost:5001/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sharePost = async () => {
    if (!content.trim() && !image) return;

    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5001/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setImage(null);
      fetchFeedPosts();
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const searchUsers = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5001/api/users/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error('Search failed', err);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleFollow = async (id, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5001/api/users/follow/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `http://localhost:5001/api/users/follow/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await searchUsers(search);
      if (showFollowers) await getFollowers();
      if (showFollowing) await getFollowing();
    } catch (err) {
      console.error('Follow/unfollow failed', err);
    }
  };

  const getFollowers = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/users/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowers(res.data);
      setShowFollowers(true);
      setShowFollowing(false);
    } catch (err) {
      console.error('Error fetching followers:', err);
    }
  };

  const getFollowing = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/users/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(res.data);
      setShowFollowing(true);
      setShowFollowers(false);
    } catch (err) {
      console.error('Error fetching following:', err);
    }
  };

  const removeFollower = async (followerId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/remove-follower/${followerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getFollowers();
    } catch (err) {
      console.error('Error removing follower', err);
    }
  };

  const goToMyPosts = () => navigate('/myposts');

  return (
    <div style={styles.pageContainer}>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
        {user && (
          <div style={styles.welcomeBanner}>
            Welcome, <strong>{user.username}</strong>
          </div>
        )}
      </div>

      <div style={styles.card}>
        {/* Search and buttons */}
        <div style={styles.followBtnGroup}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => searchUsers(e.target.value)}
            style={styles.input}
          />
          {showDropdown && (
            <ul style={styles.dropdown} ref={dropdownRef}>
              {searchResults.length === 0 ? (
                <li style={styles.noResults}>No users found</li>
              ) : (
                searchResults.map((u) => (
                  <li key={u.id} style={styles.dropdownItem}>
                    <span
                      style={styles.userName}
                      onClick={() => navigate(`/user/${u.id}`)}
                    >
                      {u.username}
                    </span>
                    <button
                      style={{
                        ...styles.followBtn,
                        backgroundColor: u.isFollowing ? '#dc3545' : '#28a745',
                      }}
                      onClick={() => handleFollow(u.id, u.isFollowing)}
                    >
                      {u.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div style={styles.followBtnGroup}>
          <button style={styles.actionBtn} onClick={getFollowers}>
            My Followers
          </button>
          <button style={styles.actionBtn} onClick={getFollowing}>
            Following
          </button>
          <button style={styles.actionBtn} onClick={goToMyPosts}>
            My Posts
          </button>
        </div>

        {/* Followers/Following list */}
        {showFollowers && (
          <div style={styles.listContainer}>
            <h4 style={styles.listTitle}>Followers</h4>
            <ul style={styles.list}>
              {followers.map((f) => (
                <li key={f.id} style={styles.listItem}>
                  <span
                    style={styles.followingItem}
                    onClick={() => navigate(`/user/${f.id}`)}
                  >
                    {f.username}
                  </span>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFollower(f.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showFollowing && (
          <div style={styles.listContainer}>
            <h4 style={styles.listTitle}>Following</h4>
            <ul style={styles.list}>
              {following.map((f) => (
                <li key={f.id} style={styles.listItem}>
                  <span
                    style={styles.followingItem}
                    onClick={() => navigate(`/user/${f.id}`)}
                  >
                    {f.username}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share post */}
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        />
        <button onClick={sharePost} style={styles.shareBtn}>
          Share
        </button>

        {/* Posts feed */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={styles.listTitle}>Posts from People You Follow</h3>
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No posts to show.</p>
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
                  <p style={styles.postUser} onClick={() => navigate(`/user/${post.user_id}`)}>
                    {post.username}
                  </p>
                  <p style={styles.timestamp}>{formattedDate}</p>
                  <p style={styles.postContent}>{post.content}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="shared post"
                      style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
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
  welcomeBanner: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#333',
    marginBottom: '1rem',
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '2rem',
    maxWidth: 600,
    width: '100%',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: '1rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  dropdown: {
    listStyle: 'none',
    padding: 0,
    margin: '5px 0 0 0',
    border: '1px solid #ccc',
    borderRadius: 6,
    maxHeight: 200,
    overflowY: 'auto',
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    cursor: 'default',
  },
  userName: {
    cursor: 'pointer',
    color: '#007BFF',
    userSelect: 'none',
  },
  followBtn: {
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '4px 10px',
    cursor: 'pointer',
  },
  noResults: {
    padding: 10,
    fontStyle: 'italic',
    color: '#777',
  },
  followBtnGroup: {
    marginBottom: '1.5rem',
  },
  actionBtn: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    marginRight: 10,
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  listContainer: {
    marginBottom: '1.5rem',
  },
  listTitle: {
    marginBottom: '0.75rem',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    borderBottom: '1px solid #eee',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '4px 10px',
    cursor: 'pointer',
  },
  followingItem: {
    cursor: 'pointer',
    color: '#007BFF',
    padding: '6px 0',
  },
  textarea: {
    width: '100%',
    height: 80,
    padding: 10,
    fontSize: '1rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  shareBtn: {
    marginTop: 10,
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  postCard: {
    border: '1px solid #ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  postUser: {
    fontWeight: 'bold',
    marginBottom: 5,
    cursor: 'pointer',
    color: '#007BFF',
  },
  postContent: {
    whiteSpace: 'pre-wrap',
  },

timestamp: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },


};
