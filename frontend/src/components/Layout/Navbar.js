import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <h1
        style={styles.logo}
        onClick={() => navigate('/')}
      >
        SODIA
      </h1>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#007BFF',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'Arial, sans-serif',
  },
  logo: {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: 0,
  }
};
