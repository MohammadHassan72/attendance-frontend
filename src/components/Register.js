import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/register`, formData);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else if (err.request) {
        setMessage('Network error. Please check your backend server.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headingStyle}>Student Registration</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            style={inputStyle}
            required
          />
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
          <button type="submit" style={submitButtonStyle}>Register</button>
        </form>
        {message && <p style={messageStyle}>{message}</p>}
        <p style={linkTextStyle}>Already have an account? <Link to="/login" style={linkStyle}>Login here</Link></p>
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

export default Register;