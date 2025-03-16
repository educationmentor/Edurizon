import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Meeting {
  _id: string;
  university: {
    name: string;
  };
  studentDetails: {
    name: string;
    email: string;
    phone: string;
    country: string;
    course: string;
  };
  status: string;
  jitsiUrl?: string;
  scheduledTime?: string;
}

interface ConsultationRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  interestedCountry: string;
  homeCountry: string;
  interestedCourse: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
  googleMeetLink?: string;
}

const CounselorDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<ConsultationRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ConsultationRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount and setup interval to check token expiry
  useEffect(() => {
    // Clear any existing user tokens to prevent conflicts
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    const counselorToken = localStorage.getItem('counselorToken');
    if (!counselorToken) {
      router.push('/counselor/login');
      return;
    }

    // Check token expiry every minute
    const interval = setInterval(() => {
      const counselorToken = localStorage.getItem('counselorToken');
      if (!counselorToken) {
        router.push('/counselor/login');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  // Fetch meetings with authentication
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('counselorToken');
        if (!token) {
          router.push('/counselor/login');
          return;
        }

        const response = await axios.get('http://localhost:5001/api/meetings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMeetings(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch meetings:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('counselorToken');
          router.push('/counselor/login');
        }
        toast.error('Failed to fetch meetings');
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('counselorToken');
    if (!token) {
      router.push('/counselor/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        setError(null);
        const [pendingRes, acceptedRes] = await Promise.all([
          axios.get('http://localhost:5001/api/consultation/pending', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/consultation/accepted', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPendingRequests(pendingRes.data.data || []);
        setAcceptedRequests(acceptedRes.data.data || []);
      } catch (error: any) {
        console.error('Failed to fetch requests:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('counselorToken');
          router.push('/counselor/login');
        } else if (error.response?.status === 404) {
          setError('Consultation service is currently unavailable');
          toast.error('Consultation service is currently unavailable');
        } else {
          setError('Failed to load consultation requests. Please try again later.');
          toast.error('Failed to load consultation requests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [router]);

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('counselorToken');
      if (!token) {
        router.push('/counselor/login');
        return;
      }

      await axios.put(
        `http://localhost:5001/api/meetings/${selectedMeeting?._id}`,
        {
          status: 'Waiting',
          scheduledTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMeetings(meetings.map((meeting) =>
        meeting._id === selectedMeeting?._id
          ? { ...meeting, status: 'Waiting', scheduledTime }
          : meeting
      ));

      toast.success('Meeting scheduled successfully!');
      setShowScheduleModal(false);
    } catch (error: any) {
      console.error('Failed to schedule meeting:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('counselorToken');
        router.push('/counselor/login');
      }
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('counselorToken');
    router.push('/counselor/login');
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('counselorToken');
      if (!token) {
        router.push('/counselor/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/consultation/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      setAcceptedRequests(prev => [...prev, response.data.data]);
      
      toast.success('Consultation request accepted successfully');
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('counselorToken');
        router.push('/counselor/login');
      } else if (error.response?.status === 404) {
        toast.error('Request no longer available');
      } else {
        toast.error('Failed to accept consultation request. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Counselor Dashboard
        </h1>

        {/* Pending Requests Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Pending Consultation Requests
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-gray-600 dark:text-gray-400 text-center">No pending requests</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {request.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>Email: {request.email}</p>
                    <p>Phone: {request.phone}</p>
                    <p>Interested Country: {request.interestedCountry}</p>
                    <p>Home Country: {request.homeCountry}</p>
                    <p>Interested Course: {request.interestedCourse}</p>
                    <p>Requested: {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Accept Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Requests Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Accepted Consultations
          </h2>
          {acceptedRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-gray-600 dark:text-gray-400 text-center">No accepted requests</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {acceptedRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {request.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>Email: {request.email}</p>
                    <p>Phone: {request.phone}</p>
                    <p>Interested Country: {request.interestedCountry}</p>
                    <p>Home Country: {request.homeCountry}</p>
                    <p>Interested Course: {request.interestedCourse}</p>
                    <p>Meeting Time: {new Date(request.createdAt).toLocaleString()}</p>
                    {request.googleMeetLink && (
                      <a
                        href={request.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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

      <ToastContainer />
    </div>
  );
};

export default CounselorDashboard;