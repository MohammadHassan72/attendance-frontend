import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [timetable, setTimetable] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dailySchedule, setDailySchedule] = useState([]);
  const [message, setMessage] = useState('');
  const [markedClasses, setMarkedClasses] = useState({});

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/timetable`);
        setTimetable(res.data);
      } catch (err) {
        setMessage('Failed to load timetable.');
        console.error(err);
      }
    };
    fetchTimetable();
  }, []);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (selectedDate && Object.keys(timetable).length > 0) {
        const date = new Date(selectedDate);
        const day = date.toLocaleDateString('en-GB', { weekday: 'long' });
        setDailySchedule(timetable[day] || []);

        try {
          const studentId = localStorage.getItem('studentId');
          if (studentId) {
            const res = await axios.get(`http://localhost:5000/api/attendance/${studentId}`);
            const dailyRecords = res.data.filter(record => 
              new Date(record.date).toLocaleDateString('en-GB') === date.toLocaleDateString('en-GB')
            );

            const marked = {};
            dailyRecords.forEach(record => {
              const uniqueKey = `${record.subject}-${record.time}`;
              marked[uniqueKey] = true;
            });
            setMarkedClasses(marked);
          }
        } catch (err) {
          setMessage('Failed to fetch attendance history.');
          console.error(err);
        }
      } else {
        setDailySchedule([]);
        setMarkedClasses({});
      }
    };

    fetchAttendanceHistory();
  }, [selectedDate, timetable]);

  const handleAttendance = async (classInfo, status) => {
    const uniqueKey = `${classInfo.subject}-${classInfo.time}`;
    if (markedClasses[uniqueKey]) {
      setMessage(`Attendance for this class has already been marked.`);
      return;
    }

    try {
      const attendanceData = {
        studentId: localStorage.getItem('studentId'),
        date: new Date(selectedDate),
        subject: classInfo.subject,
        status,
        className: 'B.E. CSE',
        time: classInfo.time,
      };

      if (classInfo.isTwoHour) {
        // Send two separate records for a 2-hour class
        await axios.post('http://localhost:5000/api/attendance/mark', attendanceData);
        await axios.post('http://localhost:5000/api/attendance/mark', attendanceData);
      } else {
        await axios.post('http://localhost:5000/api/attendance/mark', attendanceData);
      }
      
      setMessage(`Attendance marked as ${status} for ${classInfo.subject}.`);
      setMarkedClasses(prev => ({ ...prev, [uniqueKey]: true }));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Failed to mark attendance.');
      }
      console.error(err);
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ margin: 0, color: '#343a40' }}>Student Dashboard</h2>
        <nav>
          <Link to="/attendance-history" style={linkStyle}>View History</Link>
          <Link to="/logout" style={{ ...linkStyle, backgroundColor: '#dc3545' }}>Logout</Link>
        </nav>
      </header>

      <p style={{ ...textStyle, marginBottom: '20px', textAlign: 'center' }}>
        Select a date to view your daily schedule and mark attendance.
      </p>
      {message && <p style={messageStyle}>{message}</p>}

      <div style={datePickerContainerStyle}>
        <label style={textStyle}>Choose Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={dateInputStyle}
        />
      </div>

      {selectedDate && dailySchedule.length > 0 ? (
        <div style={scheduleContainerStyle}>
          <h3 style={headingStyle}>Schedule for {new Date(selectedDate).toLocaleDateString('en-GB')}</h3>
          <ul style={listStyle}>
            {dailySchedule.map((classInfo, index) => {
              const uniqueKey = `${classInfo.subject}-${classInfo.time}`;
              return (
                <li key={index} style={listItemStyle}>
                  <div style={classDetailsStyle}>
                    <h4 style={subjectHeadingStyle}>{classInfo.subject}</h4>
                    <p style={detailTextStyle}><strong>Time:</strong> {classInfo.time}</p>
                    <p style={detailTextStyle}><strong>Faculty:</strong> {classInfo.faculty}</p>
                  </div>
                  <div style={buttonGroupStyle}>
                    {markedClasses[uniqueKey] ? (
                      <p style={markedMessageStyle}>Attendance already marked.</p>
                    ) : (
                      <>
                        <button onClick={() => handleAttendance(classInfo, 'Present')} style={presentButtonStyle}>Present</button>
                        <button onClick={() => handleAttendance(classInfo, 'Absent')} style={absentButtonStyle}>Absent</button>
                        <button onClick={() => handleAttendance(classInfo, 'Faculty Absent')} style={facultyAbsentButtonStyle}>Faculty Absent</button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        selectedDate && <p style={{ ...textStyle, textAlign: 'center' }}>No classes scheduled for this day.</p>
      )}
    </div>
  );
};

// Styles
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



const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  transition: 'background-color 0.3s',
};

const textStyle = {
  color: '#555',
};

const messageStyle = {
  color: '#155724',
  backgroundColor: '#d4edda',
  border: '1px solid #c3e6cb',
  padding: '12px',
  borderRadius: '5px',
  textAlign: 'center',
  marginBottom: '25px',
  width: '100%',
  maxWidth: '800px',
};

const datePickerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '30px',
  width: '100%',
  maxWidth: '800px',
};

const dateInputStyle = {
  padding: '10px',
  border: '1px solid #ced4da',
  borderRadius: '5px',
  fontSize: '16px',
  width: '180px',
};

const scheduleContainerStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '800px',
};

const headingStyle = {
  borderBottom: '2px solid #007bff',
  paddingBottom: '15px',
  color: '#343a40',
  textAlign: 'center',
  marginBottom: '20px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const listItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  backgroundColor: '#fafafa',
};

const classDetailsStyle = {
  flexGrow: 1,
  marginBottom: '15px',
};

const subjectHeadingStyle = {
  color: '#0056b3',
  margin: '0 0 5px 0',
  fontSize: '1.2rem',
};

const detailTextStyle = {
  margin: '3px 0',
  color: '#6c757d',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  justifyContent: 'space-between',
};

const baseButtonStyle = {
  padding: '10px 18px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: 'white',
  width: 'calc(33.33% - 7px)',
};

const presentButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#28a745',
};

const absentButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#dc3545',
};

const facultyAbsentButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#ffc107',
};

const markedMessageStyle = {
  color: '#6c757d',
  fontStyle: 'italic',
  padding: '10px 15px',
  backgroundColor: '#e9ecef',
  borderRadius: '5px',
  width: '100%',
  textAlign: 'center',
};

export default Dashboard;