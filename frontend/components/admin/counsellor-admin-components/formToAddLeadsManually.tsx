import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import Select from 'react-select';
import { countryOptions, courseOptions } from '@/lib/adminData';

interface AddLeadsManuallyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FormToAddLeadsManually = ({ isOpen, onClose, onSuccess }: AddLeadsManuallyDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryInterested: '',
    courseName: '',
    remark: '',
    assignedCounsellor: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [counsellors, setCounsellors] = useState([]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryInterested: '',
        courseName: '',
        remark: '',
        assignedCounsellor: '',
      });
      setError('');
      setShowNotification(false);
      fetchCounsellors();
    }
  }, [isOpen]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        if (notificationType === 'success') {
          onClose();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, notificationType, onClose]);

  // Fetch counsellors for assignment
  const fetchCounsellors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseUrl}/api/admin/getAllCounsellors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.data) {
        setCounsellors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching counsellors:', error);
    }
  };

  const   handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowNotification(false);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${baseUrl}/api/leads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotificationType('success');
        setNotificationMessage('Lead added successfully!');
        setShowNotification(true);
        onSuccess();
      }
    } catch (err: any) {
      setNotificationType('error');
      setNotificationMessage(err.response?.data?.message || 'Failed to add lead');
      setShowNotification(true);
      setError(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 flex items-center justify-center z-[100]" style={{ margin: 0 }}>
      {/* Notification */}
      {showNotification && (
        <div
          className={`absolute top-0 left-0 right-0 p-4 ${
            notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white rounded-t-lg text-center transition-all duration-300 transform ${
            showNotification ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {notificationMessage}
        </div>
      )}

      <div className="relative bg-white rounded-lg w-[90%] max-w-lg p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Lead Manually</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lead Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Interested</label>
              <Select
                options={countryOptions}
                value={countryOptions.find(option => option.value === formData.countryInterested)}
                onChange={(option) => handleSelectChange('countryInterested', option?.value || '')}
                placeholder="Select country of interest"
                className="w-full"
                classNamePrefix="select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
              <Select
                options={courseOptions}
                value={courseOptions.find(option => option.value === formData.courseName)}
                onChange={(option) => handleSelectChange('courseName', option?.value || '')}
                placeholder="Select course of interest"
                className="w-full"
                classNamePrefix="select"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Lead to Counsellor</label>
                <select
                  name="assignedCounsellor"
                  value={formData.assignedCounsellor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select counsellor</option>
                  {counsellors.map((counsellor: any) => (
                    <option className='text-black' key={counsellor._id} value={counsellor._id}>
                      {counsellor.username}
                    </option>
                  ))}
                </select>
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter any additional notes or comments about this lead..."
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding Lead...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormToAddLeadsManually; 