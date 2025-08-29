import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAttendance = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        setMessage('Please log in to view your attendance history.');
        return;
      }
      const res = await axios.get(`http://localhost:5000/api/attendance/${studentId}`);
      setAttendance(res.data);
    } catch (err) {
      setMessage('Failed to fetch attendance history.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Corrected URL: Removed the extra `http://`
      await axios.delete(`http://localhost:5000/api/attendance/${id}`);
      setMessage('Attendance record deleted successfully!');
      // Update the state to remove the deleted item from the list
      setAttendance(attendance.filter(record => record._id !== id));
    } catch (err) {
      setMessage('Failed to delete attendance record.');
      console.error(err);
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ margin: 0, color: '#343a40' }}>Attendance History</h2>
      </header>
      {message && <p style={{ ...messageStyle, color: '#dc3545', backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>{message}</p>}
      
      {attendance.length > 0 ? (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Subject</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td style={tableCellStyle}>{new Date(record.date).toLocaleDateString('en-GB')}</td>
                  <td style={tableCellStyle}>{record.subject}</td>
                  <td style={tableCellStyle}>{record.status}</td>
                  <td style={tableCellStyle}>
                    <button onClick={() => handleDelete(record._id)} style={deleteButtonStyle}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ ...textStyle, textAlign: 'center' }}>No attendance records found.</p>
      )}
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#e9ecef',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const headerStyle = {
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  paddingBottom: '15px',
  borderBottom: '2px solid #ced4da',
};

const messageStyle = {
  padding: '12px',
  borderRadius: '5px',
  textAlign: 'center',
  marginBottom: '25px',
  width: '100%',
  maxWidth: '800px',
};

const textStyle = {
  color: '#555',
};

const tableWrapperStyle = {
  width: '100%',
  maxWidth: '800px',
  overflowX: 'auto', // Allows horizontal scrolling on small screens
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'left',
  backgroundColor: '#007bff',
  color: 'white',
};

const tableCellStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  whiteSpace: 'nowrap', // Prevents cell content from wrapping
};

const deleteButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'background-color 0.3s',
};

export default AttendanceHistory;