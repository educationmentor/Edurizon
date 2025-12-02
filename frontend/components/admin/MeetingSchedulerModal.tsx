import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (meeting: any) => void;
  adminData: any;
}

const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  adminData
}) => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    agenda: '',
    attendees: [] as { id: string; name: string }[],
    organizer: adminData?._id
  });
  const [loading, setLoading] = useState(false);

  // Fetch all admins for meeting scheduling
  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
      fetchRegisteredStudents();
    }
  }, [isOpen]);

  // Update organizer when adminData changes
  useEffect(() => {
    if (adminData?._id) {
      setMeetingData(prev => ({
        ...prev,
        organizer: adminData._id
      }));
    }
  }, [adminData]);


  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/users/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.data.status === 'success') {
        const sorted = [...response.data.data].sort((a: any, b: any) => {
          const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
          const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
          if (nameA && nameB) return nameA.localeCompare(nameB);
          return (a.email || '').toLowerCase().localeCompare((b.email || '').toLowerCase());
        });
        setAdmins(sorted);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Failed to fetch admins');
    }
  };

  const fetchRegisteredStudents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/registered-students/get-all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      console.log('response',response.data);
      if (response.data) {
        const sorted = [...response.data].sort((a: any, b: any) =>
          (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
        );
        setRegisteredStudents(sorted);
      }
    } catch (error) {
      console.error('Error fetching registered students:', error);
      alert('Failed to fetch registered students');
    }
  };

  const handleMeetingSubmit = async () => {
    if (!meetingData.attendees.length) {
      alert('Please select at least one admin');
      return;
    }

    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      alert('Please fill in all required fields');
      return;
    }

    if (!meetingData.organizer) {
      alert('Organizer information is missing. Please refresh the page and try again.');
      return;
    }

    try {
      setLoading(true);
      console.log('meetingData', meetingData);
      
      const response= await axios.post(`${baseUrl}/api/meetings/create`, meetingData);

      if (response.data.success) {
        
        onSuccess(response.data);
        onClose();
        resetMeetingForm();
        console.log('Meeting scheduled successfully:', response.data.message);
      } else {
        alert(response.data.message || 'Failed to schedule meeting');
      }
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      const errorMessage = error.response?.data?.message || 'Failed to schedule meeting';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const resetMeetingForm = () => {
    setMeetingData({
      title: '',
      date: '',
      time: '',
      duration: '60',
      agenda: '',
      attendees: [] as { id: string; name: string }[],
      organizer: adminData?._id || ''
    });
  };

  const handleAdminSelection = (adminId: string, firstName: string, lastName: string) => {
    setMeetingData(prev => {
      const isSelected = prev.attendees.some(attendee => attendee.id === adminId);
      
      if (isSelected) {
        // Remove admin from selection
        return {
          ...prev,
          attendees: prev.attendees.filter(attendee => attendee.id !== adminId)
        };
      } else {
        // Add admin to selection
        return {
          ...prev,
          attendees: [...prev.attendees, { id: adminId, name: firstName + ' ' + lastName }]
        };
      }
    });
  };

  const handleStudentSelection = (studentId: string, name: string) => {
    setMeetingData(prev => {
      const isSelected = prev.attendees.some(attendee => attendee.id === studentId);
      
      if (isSelected) {
        // Remove admin from selection
        return {
          ...prev,
          attendees: prev.attendees.filter(attendee => attendee.id !== studentId)
        };
      } else {
        // Add admin to selection
        return {
          ...prev,
          attendees: [...prev.attendees, { id: studentId, name: name }]
        };
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex min-h-full  items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Schedule Zoom Meeting</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Title *
            </label>
            <input
              type="text"
              value={meetingData.title}
              onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter meeting title"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={meetingData.date}
                onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={meetingData.time}
                onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={meetingData.duration}
              onChange={(e) => setMeetingData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Meeting
            </label>
            <textarea
              value={meetingData.agenda}
              onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={4}
              placeholder="Enter the purpose of the meeting"
            />
          </div>

          {/* Admin Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Attendees *
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
             <span className="text-sm text-gray-700">Admins</span>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <label key={admin._id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 px-2 rounded">
                    <input
                      type="checkbox"
                      checked={meetingData.attendees.some(attendee => attendee.id === admin._id)}
                      onChange={() => handleAdminSelection(admin._id, admin.firstName || '', admin.lastName || '')}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">
                      {admin.firstName && admin.lastName 
                        ? `${admin.firstName} ${admin.lastName}` 
                        : admin.username || admin.email
                      }
                      {admin.role && (
                        <span className="text-gray-500 ml-2">({admin.role})</span>
                      )}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Loading admins...</p>
              )}
              <span className="text-sm text-gray-700">Registered Students</span>
              {registeredStudents.length > 0 ? (
                registeredStudents.map((student) => (
                  <label key={student._id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 px-2 rounded">
                    <input
                      type="checkbox"
                      checked={meetingData.attendees.some(attendee => attendee.id === student._id)}
                      onChange={() => handleStudentSelection(student._id, student.name || '')}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">
                      {student.name}
                      {student.assignedCounsellorName && (
                        <span className="text-gray-500 ml-2">({student.assignedCounsellorName})</span>
                      )}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Loading admins...</p>
              )}
            </div>
            {meetingData.attendees.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {meetingData.attendees.length} attendee(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMeetingSubmit}
            disabled={loading || !meetingData.attendees.length}
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSchedulerModal;
