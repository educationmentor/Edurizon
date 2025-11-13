import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

interface ScheduledMeetingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminData: any;
}

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

const ScheduledMeetingsModal: React.FC<ScheduledMeetingsModalProps> = ({
  isOpen,
  onClose,
  adminData
}) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    if (isOpen) {
      fetchScheduledMeetings();
    }
  }, [isOpen]);

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

  const fetchScheduledMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/api/meetings/get/${adminData?._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      console.log('Full response:', response.data);
      console.log('Response structure:', {
        success: response.data.success,
        data: response.data.data,
        meetings: response.data.meetings,
        isArray: Array.isArray(response.data.data)
      });

      if (response.data.success) {
        // Handle different response structures
        const meetingsData = response.data.data || response.data.meetings || response.data || [];
        console.log('Meetings data:', meetingsData);
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
      } else {
        setError('Failed to fetch meetings');
      }
    } catch (error: any) {
      console.error('Error fetching scheduled meetings:', error);
      setError(error.response?.data?.message || 'Failed to fetch meetings');
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
    // You could add a toast notification here
  };

  const isOrganizer = (meeting: Meeting) => {
    return meeting.organizer?._id === adminData?._id || meeting.organizer === adminData?._id;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scheduled Meetings</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                  onClick={() => setDateFilter(filter.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    dateFilter === filter.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-2 text-gray-600">Loading meetings...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-medium">{error}</p>
            </div>
            <button
              onClick={fetchScheduledMeetings}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !Array.isArray(filteredMeetings) || filteredMeetings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600">
              {dateFilter === 'all' ? 'No scheduled meetings' : `No meetings found for ${dateFilter}`}
            </p>
            <p className="text-gray-500">
              {dateFilter === 'all' ? 'Schedule your first meeting to get started!' : 'Try changing the filter or schedule a new meeting.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(Array.isArray(filteredMeetings) ? filteredMeetings : []).map((meeting) => (
              <div key={meeting._id} className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${
                isOrganizer(meeting) 
                  ? 'border-teal-200 bg-teal-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{meeting.title}</h3>
                      {isOrganizer(meeting) && (
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
                          👑 You Organized
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(meeting.date)} at {formatTime(meeting.time)} • {meeting.duration} minutes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {meeting.meetingType?.toUpperCase() || 'ZOOM'}
                    </span>
                    {meeting.status && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
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

                {/* Compact agenda display */}
                {meeting.agenda && meeting.agenda !== 'no' && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600">Purpose of Meeting:</span>
                    <p className="text-xs text-gray-700 mt-0.5 line-clamp-1">{meeting.agenda}</p>
                  </div>
                )}

                {/* Compact Zoom Meeting Section */}
                {(meeting.zoomJoinUrl || meeting.zoomStartUrl) && (
                  <div className="bg-blue-50 p-2 rounded mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-blue-900">🎥 Zoom</span>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          {isOrganizer(meeting) ? 'Host' : 'Participant'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOrganizer(meeting) && meeting.zoomStartUrl ? (
                          <a
                            href={meeting.zoomStartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                            </svg>
                            <span>Start</span>
                          </a>
                        ) : meeting.zoomJoinUrl ? (
                          <a
                            href={meeting.zoomJoinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Join</span>
                          </a>
                        ) : null}
                        
                        <button
                          onClick={() => copyToClipboard(
                            isOrganizer(meeting) && meeting.zoomStartUrl 
                              ? meeting.zoomStartUrl 
                              : meeting.zoomJoinUrl || ''
                          )}
                          className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Compact Password Display */}
                    {meeting.zoomPassword && (
                      <div className="mt-2 flex items-center justify-between bg-white p-2 rounded border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700">Password:</span>
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-800">
                            {meeting.zoomPassword}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(meeting.zoomPassword!)}
                          className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Attendees:</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {meeting.attendees.length}
                    </span>
                    {meeting.attendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.attendees.slice(0, 2).map((attendee, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {typeof attendee === 'object' && attendee.firstName 
                              ? `${attendee.firstName} ${attendee.lastName || ''}`.trim()
                              : attendee
                            }
                          </span>
                        ))}
                        {meeting.attendees.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            +{meeting.attendees.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Organizer:</span>
                    <span className="text-xs text-gray-700 ml-1">
                      {meeting.organizer?.firstName} {meeting.organizer?.lastName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledMeetingsModal;
