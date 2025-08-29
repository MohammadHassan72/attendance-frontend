import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the student's ID from local storage
    localStorage.removeItem('studentId');
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;