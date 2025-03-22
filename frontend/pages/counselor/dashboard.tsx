import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '@/lib/baseUrl';
import MeetingScheduler from '@/components/MeetingScheduler';

interface ConsultationRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  interestedCountry: string;
  homeCountry: string;
  interestedCourse: string;
  status: string;
  createdAt: string;
  meetingTime?: string;
  googleMeetLink?: string;
  acceptedBy?: {
    _id: string;
    name: string;
  };
}

const CounselorDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState<ConsultationRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('counselorToken');
        
        if (!token) {
          router.push('/counselor/login');
          return;
        }

        // Use direct URL to avoid baseUrl issues
        const apiUrl = baseUrl || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/api/counselor/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.valid) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('counselorToken');
          router.push('/counselor/login');
          return;
        }

        fetchRequests();
      } catch (error: any) {
        console.error('Auth error:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('counselorToken');
          router.push('/counselor/login');
        } else {
          setError('Failed to verify authentication. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('counselorToken');
      
      // Use direct URL to avoid baseUrl issues
      const apiUrl = baseUrl || 'http://localhost:5001';
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get(`${apiUrl}/api/consultation/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/api/consultation/accepted`, {
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

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('counselorToken');
      
      // Use direct URL to avoid baseUrl issues
      const apiUrl = baseUrl || 'http://localhost:5001';
      const response = await axios.put(
        `${apiUrl}/api/consultation/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Request accepted successfully!');
      
      // Update the lists
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      setAcceptedRequests(prev => [...prev, response.data.data]);
      
      // Automatically open scheduler modal after accepting request
      setSelectedRequestId(requestId);
      setShowScheduler(true);
      
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('counselorToken');
        router.push('/counselor/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to accept request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScheduler = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowScheduler(true);
  };

  const handleScheduled = () => {
    setShowScheduler(false);
    setSelectedRequestId(null);
    fetchRequests(); // Refresh the lists
  };

  const handleLogout = () => {
    localStorage.removeItem('counselorToken');
    localStorage.removeItem('counselorData');
    router.push('/counselor/login');
    toast.info('You have been logged out');
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Counselor Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="space-y-8">
          {/* Pending Consultation Requests */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Pending Consultations
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
                      <p>Status: <span className="text-yellow-500 font-medium">Accepted</span></p>
                      <p>Accepted At: {new Date(request.createdAt).toLocaleString()}</p>
                    </div>
                    {!request.meetingTime && (
                      <button
                        onClick={() => handleOpenScheduler(request._id)}
                        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Schedule Meeting
                      </button>
                    )}
                    {request.meetingTime && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                        <p className="text-blue-800 dark:text-blue-100 font-medium">Meeting Scheduled</p>
                        <p className="text-sm text-blue-600 dark:text-blue-200">
                          Time: {new Date(request.meetingTime).toLocaleString()}
                        </p>
                        {request.googleMeetLink && (
                          <a
                            href={request.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showScheduler && selectedRequestId && (
        <MeetingScheduler
          isOpen={showScheduler}
          onClose={() => {
            setShowScheduler(false);
            setSelectedRequestId(null);
          }}
          requestId={selectedRequestId}
          onScheduled={handleScheduled}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default CounselorDashboard;