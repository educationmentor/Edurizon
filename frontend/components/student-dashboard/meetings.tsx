import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import { toast, Toaster } from 'react-hot-toast';
import { 
  VideoCall as VideoCallIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

interface Meeting {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  meetingType: string;
  status?: string;
  zoomJoinUrl?: string;
  zoomPassword?: string;
  zoomStartUrl?: string;
  attendees: any[];
  organizer: any;
  description?: string;
  agenda?: string;
  createdAt: string;
}

const Meetings = ({ userData, activeTab }: { userData: any, activeTab: string }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    if (userData && userData._id) {
      fetchMeetings();
    }
  }, [userData]);

  // Filter meetings based on date filter
  useEffect(() => {
    if (!Array.isArray(meetings)) {
      setFilteredMeetings([]);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let filtered = meetings;

    switch (dateFilter) {
      case 'today':
        filtered = meetings.filter(meeting => {
          const meetingDate = new Date(meeting.date);
          return meetingDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = meetings.filter(meeting => {
          const meetingDate = new Date(meeting.date);
          return meetingDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        filtered = meetings.filter(meeting => {
          const meetingDate = new Date(meeting.date);
          return meetingDate >= monthAgo;
        });
        break;
      default:
        filtered = meetings;
    }

    setFilteredMeetings(filtered);
  }, [meetings, dateFilter]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/api/meetings/get/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        // Handle different response structures
        const meetingsData = response.data.data || response.data.meetings || response.data || [];
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
      } else {
        setError('Failed to fetch meetings');
      }
    } catch (error: any) {
      console.error('Error fetching meetings:', error);
      setError(error.response?.data?.message || 'Failed to fetch meetings');
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      duration: 2000,
      position: 'top-right',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scheduled Meetings</h2>
        <p className="text-gray-600">
          View and join your scheduled meetings
        </p>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' }
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setDateFilter(filter.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  dateFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchMeetings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !Array.isArray(filteredMeetings) || filteredMeetings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <VideoCallIcon style={{ fontSize: '64px' }} />
          </div>
          <p className="text-lg font-medium text-gray-600">
            {dateFilter === 'all' ? 'No scheduled meetings' : `No meetings found for ${dateFilter}`}
          </p>
          <p className="text-gray-500">
            {dateFilter === 'all' 
              ? 'You don\'t have any scheduled meetings yet.' 
              : 'Try changing the filter to see more meetings.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(filteredMeetings) ? filteredMeetings : []).map((meeting) => (
            <div 
              key={meeting._id} 
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Meeting Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <VideoCallIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TimeIcon className="w-4 h-4" />
                      <span>{formatTime(meeting.time)}</span>
                    </div>
                    <span>• {meeting.duration} minutes</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {meeting.meetingType?.toUpperCase() || 'ZOOM'}
                  </span>
                  {meeting.status && (
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {meeting.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Agenda */}
              {meeting.agenda && meeting.agenda !== 'no' && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <span className="text-xs font-medium text-gray-600">Purpose of Meeting:</span>
                  <p className="text-sm text-gray-700 mt-1">{meeting.agenda}</p>
                </div>
              )}

              {/* Zoom Meeting Section */}
              {meeting.zoomJoinUrl && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-900">🎥 Zoom Meeting</span>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                        Participant
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meeting.zoomJoinUrl && (
                        <a
                          href={meeting.zoomJoinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <VideoCallIcon className="w-4 h-4" />
                          <span>Join Meeting</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(meeting.zoomJoinUrl || '')}
                        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <CopyIcon className="w-4 h-4" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Password Display */}
                  {meeting.zoomPassword && (
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Password:</span>
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm text-gray-800">
                          {meeting.zoomPassword}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(meeting.zoomPassword!)}
                        className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm transition-colors"
                      >
                        <CopyIcon className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Meeting Details Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <PersonIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Organizer:</span>
                  <span className="text-sm text-gray-600">
                    {meeting.organizer?.firstName} {meeting.organizer?.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Attendees:</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm">
                    {meeting.attendees.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
