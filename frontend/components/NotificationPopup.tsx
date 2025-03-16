import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/20/solid';

interface Notification {
  _id: string;
  status: 'pending' | 'accepted' | 'completed';
  meetingTime?: string;
  googleMeetLink?: string;
  acceptedBy?: {
    name: string;
    email: string;
  };
}

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        const response = await axios.get(`http://localhost:5001/api/consultation/student?email=${userEmail}`);
        setNotifications(response.data.data);
        
        // Check for new notifications
        const hasNew = response.data.data.some(
          (notif: Notification) => 
            notif.status === 'accepted' && 
            !localStorage.getItem(`notif-${notif._id}-seen`)
        );
        setHasNewNotifications(hasNew);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    localStorage.setItem(`notif-${notificationId}-seen`, 'true');
    setHasNewNotifications(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      >
        <BellIcon className="h-6 w-6" />
        {hasNewNotifications && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 dark:text-gray-400">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className={`font-medium ${getStatusColor(notification.status)}`}>
                    {notification.status === 'pending' && 'Consultation Request Pending'}
                    {notification.status === 'accepted' && 'Consultation Scheduled!'}
                    {notification.status === 'completed' && 'Consultation Completed'}
                  </div>
                  
                  {notification.status === 'accepted' && notification.acceptedBy && (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Counselor: {notification.acceptedBy.name}
                      </p>
                      {notification.meetingTime && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Time: {formatDate(notification.meetingTime)}
                        </p>
                      )}
                      {notification.googleMeetLink && (
                        <a
                          href={notification.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Join Meeting
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup; 