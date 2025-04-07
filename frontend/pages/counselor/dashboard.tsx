import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '@/lib/baseUrl';
import MeetingScheduler from '@/components/MeetingScheduler';
import ChatBox from '@/components/ChatBox';

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
  acceptedBy?: string;
  meetingTime?: string;
  googleMeetLink?: string;
}

const CounselorDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState<ConsultationRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState<ConsultationRequest | null>(null);
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
        // const apiUrl = baseUrl || 'http://localhost:5001';
        const response = await axios.get(`${baseUrl}/api/counselor/verify`, {
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
      // const apiUrl = baseUrl || 'http://localhost:5001';
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get(`${baseUrl}/api/consultation/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseUrl}/api/consultation/accepted`, {
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
      // const apiUrl = baseUrl || 'http://localhost:5001';
      const response = await axios.put(
        `${baseUrl}/api/consultation/accept/${requestId}`,
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

  const handleOpenChat = (request: ConsultationRequest) => {
    setActiveChatRequest(request);
    setShowChatBox(true);
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
      <ToastContainer position="top-right" autoClose={5000} />
      
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
                <p className="text-gray-600 dark:text-gray-400 text-center">No accepted requests yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {acceptedRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {request.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Accepted
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>Email: {request.email}</p>
                      <p>Phone: {request.phone}</p>
                      <p>Interested Country: {request.interestedCountry}</p>
                      <p>Home Country: {request.homeCountry}</p>
                      <p>Interested Course: {request.interestedCourse}</p>
                      <p>Accepted on: {new Date(request.createdAt).toLocaleString()}</p>
                      
                      {request.meetingTime && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <p className="font-medium text-blue-700 dark:text-blue-300">
                            Meeting scheduled for: {new Date(request.meetingTime).toLocaleString()}
                          </p>
                          {request.googleMeetLink && (
                            <a
                              href={request.googleMeetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline block mt-1"
                            >
                              Join Google Meet
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {!request.meetingTime && (
                        <button
                          onClick={() => handleOpenScheduler(request._id)}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Schedule Meeting
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenChat(request)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      {selectedRequestId && (
        <MeetingScheduler
          isOpen={showScheduler}
          requestId={selectedRequestId}
          onClose={() => setShowScheduler(false)}
          onScheduled={handleScheduled}
        />
      )}

      {/* Chat Box Modal */}
      {showChatBox && activeChatRequest && (
        <ChatBox
          requestId={activeChatRequest._id}
          studentName={activeChatRequest.name}
          userType="counselor"
          onClose={() => {
            setShowChatBox(false);
            setActiveChatRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default CounselorDashboard;