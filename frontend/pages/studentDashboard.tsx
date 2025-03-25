import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAuthToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { baseUrl } from '@/lib/baseUrl';

interface Meeting {
  _id: string;
  status: string;
  acceptedBy?: {
    name: string;
    email: string;
  };
  meetingTime: string;
  googleMeetLink: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || `${baseUrl}`;

// Helper function to validate Google Meet links
const isValidMeetLink = (link: string | undefined): boolean => {
  if (!link) return false;
  
  // Accept any link from Google Meet
  return link.startsWith('https://meet.google.com/');
};

const StudentDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        
        if (!token) {
          console.log('[STUDENT] No auth token found, redirecting to login');
          router.push('/auth/login');
          return;
        }
        
        // Get user email from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.log('[STUDENT] No user data found');
          router.push('/auth/login');
          return;
        }

        const user = JSON.parse(userData);
        const email = user.email;
        
        console.log('[STUDENT] Fetching meetings for:', email);
        
        const response = await axios.get(
          `${API_URL}/api/consultation/student?email=${email}`, 
          {
            headers: {
              Authorization: token
            }
          }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Only show scheduled/accepted meetings
          const scheduledMeetings = response.data.data.filter(
            (meeting: Meeting) => meeting.status === 'scheduled' || meeting.status === 'accepted'
          );
          
          // Log only upcoming meetings with their links
          const now = new Date();
          const upcomingMeetings = scheduledMeetings.filter((meeting: Meeting) => {
            return meeting.status === 'scheduled' && new Date(meeting.meetingTime) > now;
          });
          
          if (upcomingMeetings.length > 0) {
            console.log(`[STUDENT] Found ${upcomingMeetings.length} upcoming meetings`);
            upcomingMeetings.forEach((meeting: Meeting) => {
              console.log(`[STUDENT] Meeting ${meeting._id} link: ${meeting.googleMeetLink || 'NO LINK'}`);
            });
          }
          
          setMeetings(scheduledMeetings);
        } else {
          console.error('[STUDENT] Unexpected response format:', response.data);
          setError('Received unexpected data format from server');
        }
      } catch (error: any) {
        console.error('[STUDENT] Error details:', error.response?.data);
        console.error('[STUDENT] Error status:', error.response?.status);
        console.error('[STUDENT] Failed to fetch meetings:', error);
        
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
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchMeetings, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Open Google Meet in a new window with proper config
  const joinMeeting = (meetLink: string) => {
    // Open in a new window with features that make it more reliable
    window.open(
      meetLink, 
      '_blank',
      'noopener,noreferrer,resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes'
    );
    
    // Also copy to clipboard as a backup
    navigator.clipboard.writeText(meetLink)
      .then(() => toast.info('Meet link copied to clipboard as backup'))
      .catch(() => console.error('Failed to copy link'));
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
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Status: {meeting.status}
                      </p>
                    </div>
                    
                    {meeting.googleMeetLink && isValidMeetLink(meeting.googleMeetLink) ? (
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => joinMeeting(meeting.googleMeetLink)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Join Meeting
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(meeting.googleMeetLink);
                            toast.success('Meeting link copied to clipboard');
                          }}
                          className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Copy Link
                        </button>
                      </div>
                    ) : meeting.status === 'scheduled' ? (
                      <span className="text-sm text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-100 dark:bg-amber-900 rounded-md">
                        Meeting link will be available soon
                      </span>
                    ) : null}
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