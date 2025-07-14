import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './components/Home';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import MyPosts from './components/MyPosts'; // <--- Import MyPosts here
import Navbar from './components/Navbar';

function App() {
  // Initialize from localStorage immediately
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/user/:id"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />

        {/* New MyPosts Route */}
        <Route
          path="/myposts"
          element={isAuthenticated ? <MyPosts /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
