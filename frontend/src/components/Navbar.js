import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#282c34',
        color: 'white',
        fontFamily: 'Verdana, sans-serif',
      }}
    >
      <h1
        onClick={handleLogoClick}
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#61dafb',
          margin: 0,
        }}
      >
        SODIA
      </h1>

      {/* Conditional buttons based on auth */}
      <div>
        {!token && location.pathname !== '/login' && (
          <button onClick={() => navigate('/login')} style={buttonStyle}>
            Login
          </button>
        )}
        {!token && location.pathname !== '/signup' && (
          <button onClick={() => navigate('/signup')} style={buttonStyle}>
            Signup
          </button>
        )}

        {token && (
          <>
            <button onClick={() => navigate('/profile')} style={buttonStyle}>
              Profile
            </button>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const buttonStyle = {
  marginLeft: '1rem',
  padding: '8px 16px',
  fontSize: '0.9rem',
  backgroundColor: '#61dafb',
  border: 'none',
  borderRadius: '4px',
  color: 'black',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'red',
  color: 'white',
};
