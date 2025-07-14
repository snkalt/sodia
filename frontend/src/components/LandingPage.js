import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome to <span style={styles.brand}>SODIA</span></h1>
          <p style={styles.tagline}>Connect. Share. Grow.</p>
          <div style={styles.buttonGroup}>
            <button onClick={() => navigate('/login')} style={styles.button}>Login</button>
            <button onClick={() => navigate('/signup')} style={{ ...styles.button, backgroundColor: '#28a745' }}>
              Signup
            </button>
          </div>
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
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  brand: {
    color: '#6e8efb',
  },
  tagline: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    color: 'white',
    backgroundColor: '#007BFF',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
