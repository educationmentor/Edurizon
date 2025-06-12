import React, { useState, useEffect } from 'react';
import DocumentLayout from '@/components/admin/DocumentLayout';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import { PencilIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

interface Document {
  _id: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  studentName: string;
  documentType: string;
}

const ITEMS_PER_PAGE = 10;

const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; documentId: string | null }>({
    isOpen: false,
    documentId: null
  });
  const [adminData, setAdminData] = useState<any>(null);
  useEffect(() => {
    const value = localStorage.getItem('adminData');
    const parsedValue = JSON.parse(value || '{}');
    setAdminData(parsedValue);
  }, []);   
  useEffect(() => {
    if(adminData?.role==='documentHandler'){
      fetchDocuments();
    }
  }, [activeTab,adminData]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}/api/admin/documents?status=${activeTab}`, {
        headers: {
          Authorization: authToken
        }
      });

      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/admin';
      } else {
        setError(err.response?.data?.message || 'Failed to fetch documents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (documentId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      documentId
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.documentId) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await axios.delete(`${baseUrl}/api/admin/documents/${deleteConfirmation.documentId}`, {
        headers: {
          Authorization: authToken
        }
      });

      if (response.data.success) {
        toast.success('Document deleted successfully', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
          },
        });
        fetchDocuments();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/admin';
      } else {
        toast.error(err.response?.data?.message || 'Failed to delete document', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    } finally {
      setDeleteConfirmation({ isOpen: false, documentId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, documentId: null });
  };

  const handleStatusChange = async (documentId: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await axios.put(
        `${baseUrl}/api/admin/documents/${documentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken
          }
        }
      );

      if (response.data.success) {
        toast.success('Document status updated successfully', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
          },
        });
        fetchDocuments();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/admin';
      } else {
        toast.error(err.response?.data?.message || 'Failed to update document status', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    }
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await axios.get(`${baseUrl}/api/admin/documents/${documentId}/download`, {
        headers: {
          Authorization: authToken
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error('Failed to download document', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
        },
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = documents.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <DocumentLayout>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbAdmin role={adminData?.role} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Manage and verify student documents</p>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`${
                  activeTab === 'pending'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`${
                  activeTab === 'verified'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Verified
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`${
                  activeTab === 'rejected'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Rejected
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Document Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((document) => (
                  <tr key={document._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{document.fileName}</div>
                          <div className="text-sm text-gray-500">{document.documentType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          document.status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : document.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDownload(document._id, document.fileName)}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        {activeTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(document._id, 'verified')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(document._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-end p-4 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-teal-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <span className="ml-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Delete Document
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this document? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DocumentLayout>
  );
};

export default DocumentManagement;
