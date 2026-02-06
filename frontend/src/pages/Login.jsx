import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f6f7f9' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ background: '#7b68ee', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 'bold' }}>M</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#292d34' }}>Sign In</h2>
            <p style={{ color: '#7e828e', fontSize: '0.9rem' }}>Welcome back to Meta Scraper Pro</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: '#292d34' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required 
              placeholder="name@company.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e6e9ee', outline: 'none' }}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: '#292d34' }}>PASSWORD</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e6e9ee', outline: 'none' }}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#7b68ee', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
            Sign In to Dashboard
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#7e828e' }}>
          Don't have an account? <Link to="/register" style={{ color: '#7b68ee', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;