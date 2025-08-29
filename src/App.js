import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AttendanceHistory from './components/AttendanceHistory';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <div className="App" style={appContainerStyle}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance-history" element={<AttendanceHistory />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <footer style={footerStyle}>
          <p>
            &copy; {new Date().getFullYear()} Self Attendance Tracker | Made by 
            <a href="https://www.linkedin.com/in/mohammadhassan72/" target="_blank" rel="noopener noreferrer" style={linkStyle}> Hasxan</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const footerStyle = {
  textAlign: 'center',
  padding: '20px',
  marginTop: 'auto',
  backgroundColor: '#343a40',
  color: '#ffffff',
  width: '100%',
};

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

export default App;