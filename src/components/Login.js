import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/login`, formData);
      setMessage(res.data.message);
      localStorage.setItem('studentId', res.data.studentId);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Login failed. Please check your network and backend.');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headingStyle}>Student Login</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <button type="submit" style={submitButtonStyle}>Login</button>
        </form>
        {message && <p style={messageStyle}>{message}</p>}
        <p style={linkTextStyle}>Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link></p>
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f0f2f5',
};

const formCardStyle = {
  padding: '40px',
  borderRadius: '10px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
};

const headingStyle = {
  color: '#333',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
  transition: 'border-color 0.3s ease-in-out',
};

const submitButtonStyle = {
  padding: '12px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out',
};

const messageStyle = {
  marginTop: '20px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#d4edda',
  color: '#155724',
};

const linkTextStyle = {
  marginTop: '15px',
  fontSize: '14px',
  color: '#555',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontWeight: 'bold',
};

export default Login;