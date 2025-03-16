import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAuthToken, useAuth } from '../utils/auth';
import { toast } from 'react-toastify';

interface Meeting {
  _id: string;
  status: string;
  acceptedBy: {
    name: string;
    email: string;
  };
  meetingTime: string;
  googleMeetLink: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const StudentDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useAuth('student');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        console.log('Auth Token:', token); // Debug log

        if (!token) {
          console.log('No auth token found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('Making request to:', `${API_URL}/api/meetings`);
        
        const response = await axios.get(`${API_URL}/api/meetings`, {
          headers: {
            Authorization: token
          }
        });

        console.log('Response:', response.data); // Debug log
        setMeetings(response.data);
      } catch (error) {
        console.error('Error details:', error.response?.data); // Debug log
        console.error('Error status:', error.response?.status); // Debug log
        console.error('Failed to fetch meetings:', error);
        
        setError('Failed to fetch meetings. Please try again later.');
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            router.push('/auth/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Student Dashboard
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Meetings
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!error && meetings.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming meetings scheduled.
            </p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Meeting with: {meeting.acceptedBy?.name || 'Counselor'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Time: {formatDate(meeting.meetingTime)}
                      </p>
                    </div>
                    {meeting.googleMeetLink && (
                      <a
                        href={meeting.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;