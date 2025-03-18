import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {baseUrl} from '@/lib/baseUrl';
interface ConsultationFormProps {
  onClose: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedCountry: '',
    homeCountry: '',
    interestedCourse: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('Please login to book a consultation');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user.email || !user.name || !user.token) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      const requestData = {
        ...formData,
        email: user.email,
        name: user.name,
        status: 'pending'
      };

      console.log('Sending request with token:', user.token);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || `${baseUrl}`}/api/consultation/request`, 
        requestData,
        {
          headers: {
            'Authorization': user.token
          }
        }
      );

      if (response.data.success) {
        toast.success('Consultation request submitted successfully! Check your notifications for updates.');
        onClose();
      }
    } catch (error: any) {
      console.error('Consultation request error:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        localStorage.removeItem('user');
      } else if (error.response) {
        toast.error(error.response.data.message || 'Failed to submit consultation request');
      } else if (error.request) {
        toast.error('Unable to reach the server. Please check your internet connection.');
      } else {
        toast.error('An error occurred while submitting your request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Book a Free Consultation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interested Country</label>
            <input
              type="text"
              name="interestedCountry"
              value={formData.interestedCountry}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Home Country</label>
            <input
              type="text"
              name="homeCountry"
              value={formData.homeCountry}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interested Course</label>
            <input
              type="text"
              name="interestedCourse"
              value={formData.interestedCourse}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orangeChosen focus:border-orangeChosen dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-3">
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
              className="px-4 py-2 text-sm font-medium text-white bg-orangeChosen rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeChosen disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
};

export default ConsultationForm; 