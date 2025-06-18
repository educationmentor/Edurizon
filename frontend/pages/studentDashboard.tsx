import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAuthToken } from '../utils/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '@/lib/baseUrl';
import ChatBox from '@/components/ChatBox';



const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState<'user' | 'counselor' | null>(null);

  const router = useRouter();
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userData = localStorage.getItem('user');
        const counselorToken = localStorage.getItem('counselorToken');
        
        if (userData) {
          const user = JSON.parse(userData);
          setIsLoggedIn(true);
          // Get first name only
          const firstName = (user.user?.name || user.name || '').split(' ')[0];
          setUserName(firstName);
          setUserType('user');
        } else if (counselorToken) {
          const counselorData = localStorage.getItem('counselorData');
          const counselor = counselorData ? JSON.parse(counselorData) : {};
          setIsLoggedIn(true);
          setUserName(counselor.name || '');
          setUserType('counselor');
        } else {
          setIsLoggedIn(false);
          setUserType(null);
          setUserName('');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
      }
    };

    // Check auth status immediately
    checkAuthStatus();

    // Set up an interval to check auth status periodically
    const interval = setInterval(checkAuthStatus, 5000); // Check every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
 
  const handleLogout = () => {
    if (userType === 'user') {
      localStorage.removeItem('user');
    } else if (userType === 'counselor') {
      localStorage.removeItem('counselorToken');
      localStorage.removeItem('counselorData');
    }
    setIsLoggedIn(false);
    setUserName('');
    setUserType(null);
    router.push('/');
  };


  return (
   <div>
    hi
   </div>
  );
};

export default StudentDashboard;