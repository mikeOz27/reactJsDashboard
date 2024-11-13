import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/index'
import Home from './components/Home/index';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userAuth, setUser] = useState(JSON.parse(localStorage.getItem('userAuth')));

  useEffect(() => {}, [token, userAuth]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userAuth');
    setToken(null);
    setUser(null);
  };

  return (
    console.log('userAuth', userAuth), 
    console.log('token', token),
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={setToken} setUser={setUser} />} />
        <Route path="/" element={
          token ? <Home 
                        token={token} 
                        userAuth={userAuth}
                        onLogout={handleLogout} 
                  /> : <Navigate to="/login" />} 
        />
        {/* <Route path="/" element={
          token ? <Dashboard
                        token={token}
                        userAuth={userAuth}
                        onLogout={handleLogout}
                  /> : <Navigate to="/login" />}
        /> */}
      </Routes>
    </Router>
  );
};

export default App;