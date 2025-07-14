import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = form; // exclude confirmPassword from request
      await axios.post('http://localhost:5001/api/auth/signup', dataToSend);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your <span style={styles.brand}>SODIA</span> Account</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>Gender:</label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === 'Male'}
                  onChange={handleChange}
                /> Male
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === 'Female'}
                  onChange={handleChange}
                /> Female
              </label>
            </div>

            <label style={styles.label}>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />

            {errorMsg && <p style={styles.error}>{errorMsg}</p>}

            <button type="submit" style={styles.button}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
    maxWidth: '420px',
    width: '90%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.8rem',
    color: '#333',
  },
  brand: {
    color: '#6e8efb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '1rem',
    boxSizing: 'border-box',
  },
  label: {
    fontWeight: '600',
    marginBottom: '5px',
    display: 'block',
    color: '#555',
  },
  radioLabel: {
    marginRight: '1.5rem',
    fontWeight: '500',
    color: '#333',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};
