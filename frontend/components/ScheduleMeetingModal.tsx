import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ScheduleMeetingModalProps {
  requestId: string;
  onClose: () => void;
  onScheduled: (meetingTime: string, meetLink: string) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  requestId,
  onClose,
  onScheduled
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Get minimum date (today) and maximum date (30 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('counselorToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      const meetingDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/consultation/schedule/${requestId}`,
        {
          meetingTime: meetingDateTime.toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onScheduled(meetingDateTime.toISOString(), response.data.data.googleMeetLink);
        toast.success('Meeting scheduled successfully!');
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to schedule meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Schedule Consultation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              min={today}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal; 