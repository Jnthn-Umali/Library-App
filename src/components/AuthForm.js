// src/components/AuthForm.js
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './AuthForm.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error('❌ JSON parse error:', err);
        setMessage('Invalid response from server.');
        return;
      }

      if (!res.ok) {
        setMessage(data.message || 'Something went wrong.');
        return;
      }

      setMessage(data.message || (isLogin ? 'Logged in!' : 'Registered!'));

      if (isLogin && data.role) {
        // Redirect based on role
        if (data.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (data.role === 'staff') {
          window.location.href = '/dashboard/staff';
        } else {
          window.location.href = '/dashboard/user';
        }
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setMessage('Network error or server is down.');
    }
  };

  const formContent = (
    <motion.div
      key={isLogin ? 'login' : 'register'}
      className="auth-form"
      initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Age"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p className="toggle-text">
        {isLogin ? (
          <>
            Don’t have an account? <span onClick={() => setIsLogin(false)}>Signup now</span>
          </>
        ) : (
          <>
            Already have an account? <span onClick={() => setIsLogin(true)}>Login</span>
          </>
        )}
      </p>
    </motion.div>
  );

  const infoContent = (
    <motion.div
      key={isLogin ? 'info-register' : 'info-login'}
      className="auth-info"
      initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2
        style={{
          fontSize: '32px',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          marginBottom: '24px',
        }}
      >
        {isLogin ? 'Every new friend is a new adventure.' : 'Welcome back!'}
      </h2>
      <p
        style={{
          fontSize: '18px',
          marginBottom: '30px',
          opacity: '0.9',
          lineHeight: '1.5',
        }}
      >
        {isLogin ? 'Let’s get connected' : 'Login to stay connected'}
      </p>
      <button
        className="toggle-button"
        onClick={() => setIsLogin(!isLogin)}
        style={{
          background: 'white',
          color: '#6a11cb',
          border: '2px solid #ffffff',
          padding: '14px 24px',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f8f8f8';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        }}
      >
        {isLogin ? 'Register' : 'Back to Login'}
      </button>
    </motion.div>
  );

  return (
    <div className="auth-wrapper">
      <motion.div
        className="auth-left"
        style={{ order: isLogin ? 1 : 2 }}
        initial={{ x: isLogin ? 0 : '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? formContent : infoContent}
      </motion.div>
      <motion.div
        className="auth-right"
        style={{ order: isLogin ? 2 : 1 }}
        initial={{ x: isLogin ? 0 : '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? infoContent : formContent}
      </motion.div>
    </div>
  );
}
