import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '@/lib/baseUrl';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onScheduled: () => void;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  isOpen,
  onClose,
  requestId,
  onScheduled
}) => {
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [meetingTime, setMeetingTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingDate || !meetingTime) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('counselorToken');
      const apiUrl = baseUrl || 'http://localhost:5001';
      
      // Combine date and time into a single ISO string
      const dateTimeString = `${meetingDate}T${meetingTime}`;
      
      await axios.put(
        `${apiUrl}/api/consultation/schedule/${requestId}`,
        {
          meetingTime: dateTimeString
          // No need to send googleMeetLink - backend will generate it
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Meeting scheduled successfully!');
      onScheduled();
    } catch (error: any) {
      console.error('Failed to schedule meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Schedule Meeting</h2>
        <form onSubmit={handleSchedule}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meeting Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meeting Time
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingScheduler;