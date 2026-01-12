import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../lib/baseUrl';
import { 
  CloudUpload as CloudUploadIcon, 
  CheckCircle as CheckCircleIcon, 
  AccessTime as ClockIcon, 
  Cancel as XCircleIcon,
  Visibility as EyeIcon,
  Delete as TrashIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

interface FeeInfo {
    status: 'due' | 'completed';
    url: string;
    description:string;
  }

interface DocumentsProps {
  activeTab: string;
  userData: any;
}

const Fees = ({ activeTab, userData }: DocumentsProps) => {
  const [loading, setLoading] = useState(true);
  const [imgModal, setImgModal] = useState({
    open: false,
    imgUrl: '',
    studentName: '',
  });
  const [filteredBills, setFilteredBills] = useState<FeeInfo[]>([]);
  const [agreeDialogOpen, setAgreeDialogOpen] = useState(false);
  const [updatingAgreement, setUpdatingAgreement] = useState(false); 

  const openImgModal = (imgUrl:string, studentName:string) => {
    setImgModal({
      open: true,
      imgUrl,
      studentName,
    });
  };
  
  const closeImgModal = () => {
    setImgModal({
      open: false,
      imgUrl: '',
      studentName: '',
    });
  };

  useEffect(()=>{
    // Only show completed bills (receipts) - using new financeInfo.bills structure
    if (userData?.financeInfo?.bills && Array.isArray(userData.financeInfo.bills)) {
      // Get bills from financeInfo.bills and filter for completed ones
      const completedBills = userData.financeInfo.bills.map((bill: any) => ({
        status: 'completed',
        url: bill.url || '',
        description: bill.purpose || 'Payment Receipt',
        date: bill.date,
        amount: bill.amount,
        currency: bill.currency
      })).filter((bill: any) => bill.url); // Only show bills with URLs (completed receipts)
      setFilteredBills(completedBills);
    } else {
      // Fallback: if financeInfo doesn't exist, use empty array
      setFilteredBills([]);
    }
  }, [userData])

  useEffect(() => {
    if (userData ) {
      setLoading(false);
    }
  }, [userData]);
  

  const handleDownloadDocument = async (url: string, docName:string) => {
    if (!url){
      console.log('url is not found');
      return};
  
    try {
      const response = await fetch(url);
      const blob = await response.blob();
  
      const blobUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
  
      // filename (extract from URL or default)
      link.download = docName ||"document.jpg";
  
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleAgreementCheckbox = () => {
    if (!userData.feeStructureAgreed) {
      setAgreeDialogOpen(true);
    }
  };

  const handleConfirmAgreement = async () => {
    try {
      setUpdatingAgreement(true);
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').token : null;
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.put(
        `${baseUrl}/api/registered-students/fee-structure/agree`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('You have successfully agreed to the fee structure terms');
        setAgreeDialogOpen(false);
        // Refresh user data
        window.location.reload(); // Or use a refetch function if available
      }
    } catch (error: any) {
      console.error('Failed to update agreement:', error);
      toast.error(error?.response?.data?.message || 'Failed to update agreement');
    } finally {
      setUpdatingAgreement(false);
    }
  };
  
  
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      
      {/* Header */}
      
      {userData && userData.feeStructure &&
        <div className='mb-8'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fees Structure</h2>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Document Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Fees Structure</h3>
                  
                </div>
              </div>
            </div>

            {/* Document Actions */}
            <div className="flex space-x-2 mb-4">
            <button
                onClick={() => openImgModal(userData.feeStructure, userData.name)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
            >
                <EyeIcon className="w-4 h-4 mr-1" />
                View
            </button>
            <button
            onClick={() => handleDownloadDocument(userData.feeStructure, 'fees structure')}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
            >
            
            Download
            </button>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userData.feeStructureAgreed || false}
                  onChange={handleAgreementCheckbox}
                  disabled={userData.feeStructureAgreed}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`text-sm ${userData.feeStructureAgreed ? 'text-gray-500' : 'text-gray-700'}`}>
                  I agree with the fees, info and terms given in the fee structure
                </span>
              </label>
              {userData.feeStructureGeneratedDate && (
                <p className="text-xs text-gray-500 mt-2 ml-7">
                  Generated on: {new Date(userData.feeStructureGeneratedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
      </div>
      </div>
      }

      {userData && userData.feeStructure &&
        <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bills</h2>
        <p className="text-sm text-gray-600">Payment receipts for completed transactions</p>
      </div>

      {/* Documents Table */}
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
          Document
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      {/* Fees Structure Row */}
      {filteredBills && filteredBills.map((item, idx) => {
  return (
    <tr key={idx} className="border-t">
        <td className="px-6 py-4 flex items-center space-x-3">
          <DocumentIcon className="w-6 h-6 text-blue-600" />
          <span className="font-medium text-gray-900">{item.description}</span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openImgModal(item.url, userData.name)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </button>

            <button
              onClick={() => handleDownloadDocument(item.url, `bill ${idx + 1}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              Download
            </button>
          </div>
        </td>
      </tr>
  );
})}


      
    </tbody>
  </table>
</div>

      </div>
      }
    {imgModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl  max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                   {imgModal.studentName}
                </p>
                <p className="text-sm text-gray-500">Document</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={imgModal.imgUrl || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-teal-600 hover:text-teal-800"
                >
                  Open in New Tab
                </a>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={closeImgModal}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="px-6 py-4 overflow-hidden h-[calc(90vh-80px)]">
            <img
                  src={imgModal.imgUrl || ''}
                  alt="Fee Structure"
                  className="max-w-full max-h-full object-contain"
                />
            </div>
          </div>
        </div>
      )}

      {/* Agreement Confirmation Dialog */}
      {agreeDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Agreement
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to agree to the fees, information, and terms given in the fee structure? 
              This action will notify the finance admin.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={() => setAgreeDialogOpen(false)}
                disabled={updatingAgreement}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAgreement}
                disabled={updatingAgreement}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingAgreement ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
