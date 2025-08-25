import React, { useState } from 'react';

interface AddStudentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
}

const AddStudentPopup: React.FC<AddStudentPopupProps> = ({ isOpen, onClose, onOptionSelect }) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'registered-student',
      title: 'Add Registered Student',
      description: 'Add a student who has already registered with the system',
      icon: '👤',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'manual-lead',
      title: 'Add Lead Manually',
      description: 'Manually enter lead information for a new prospect',
      icon: '✏️',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'import-excel',
      title: 'Import Leads from Excel',
      description: 'Bulk import leads from an Excel file',
      icon: '📊',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Student/Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group ${option.color} text-white`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{option.title}</h3>
                  <p className="text-xs opacity-90 mt-1">{option.description}</p>
                </div>
                <svg
                  className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPopup;
