import React from 'react';

interface MeetingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledMeeting: any;
}

const MeetingSuccessModal: React.FC<MeetingSuccessModalProps> = ({
  isOpen,
  onClose,
  scheduledMeeting
}) => {
  if (!isOpen || !scheduledMeeting) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduled Successfully! 🎉</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
          {/* Meeting Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span className="font-medium">Title:</span> {scheduledMeeting.data.title}
              </div>
              <div>
                <span className="font-medium">Date:</span> {scheduledMeeting.data.date}
              </div>
              <div>
                <span className="font-medium">Time:</span> {scheduledMeeting.data.time}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {scheduledMeeting.data.duration} minutes
              </div>
              
            </div>
          </div>

          {/* Zoom Meeting Details */}
          {scheduledMeeting.data && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🎥 Zoom Meeting Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-blue-900">Join URL:</span>
                  <a 
                    href={scheduledMeeting.data.zoomJoinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2 break-all"
                  >
                    {scheduledMeeting.data.zoomJoinUrl}
                  </a>
                </div>
                {scheduledMeeting.data.zoomPassword && (
                  <div>
                    <span className="font-medium text-blue-900">Password:</span>
                    <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
                      {scheduledMeeting.data.zoomPassword}
                    </span>
                  </div>
                )}
                {scheduledMeeting.data.zoomStartUrl && (
                  <div>
                    <span className="font-medium text-blue-900">Host Start URL:</span>
                    <a 
                      href={scheduledMeeting.data.zoomStartUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline ml-2 break-all"
                    >
                      {scheduledMeeting.data.zoomStartUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          {scheduledMeeting.data.agenda && scheduledMeeting.data.agenda.length > 0 && (
            <div>
              <span className="font-medium">Agenda:</span>
              <p className="text-gray-700 mt-1">{scheduledMeeting.data.agenda}</p>
            </div>
          )}

          {/* Attendees List */}
          {scheduledMeeting.attendees && scheduledMeeting.attendees.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">👥 Attendees ({scheduledMeeting.attendees.length})</h4>
              <div className="space-y-1">
                {scheduledMeeting.attendees.map((attendee: any, index: number) => (
                  <div key={index} className="text-sm text-gray-700">
                    • {attendee.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
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

export default MeetingSuccessModal;
