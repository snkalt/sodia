import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [form, setForm] = useState({
    username: '',
    gender: '',
    dob: '',
    phone: '',
    email: ''
  });

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setForm(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Failed to load profile.');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5001/api/users/me',
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('Profile updated successfully!');
      navigate('/dashboard'); // ← Changed here
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // ← Changed here
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={styles.input}
          />

          <div style={styles.genderGroup}>
            <label style={styles.genderLabel}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === 'Male'}
                onChange={handleChange}
              />{' '}
              Male
            </label>
            <label style={{ ...styles.genderLabel, marginLeft: 20 }}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === 'Female'}
                onChange={handleChange}
              />{' '}
              Female
            </label>
          </div>

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            required
            style={styles.input}
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={styles.input}
          />

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    background:
      'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    minHeight: '100vh',
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  title: {
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '1.25rem',
    boxSizing: 'border-box',
  },
  genderGroup: {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  genderLabel: {
    fontWeight: '600',
    color: '#555',
    cursor: 'pointer',
    userSelect: 'none',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginRight: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: 'grey',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
};
