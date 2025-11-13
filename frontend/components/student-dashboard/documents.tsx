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

interface Document {
  name: string;
  link: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  remark?: string;
}

interface DocumentsProps {
  activeTab: string;
  userData: any;
}

const Documents = ({ activeTab, userData }: DocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    if (userData && userData.documents) {
      setDocuments(userData.documents);
      setLoading(false);
    }
  }, [userData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'uploaded':
        return <CloudUploadIcon className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-600" />;
    }
  };


  const handleUpload = async (documentName: string) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentName', documentName);

      const response = await axios.post(`${baseUrl}/api/registered-students/uploadDocument/${userData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success('Document uploaded successfully!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
          },
        });
        
        // Update the document status
        setDocuments(prev => prev.map(doc => 
          doc.name === documentName 
            ? { ...doc, status: 'uploaded', link: response.data.document.link }
            : doc
        ));
        
        setSelectedFile(null);
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.link) {
      window.open(document.link, '_blank');
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h2>
        <p className="text-gray-600">Upload and track your required documents</p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Document Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{document.name}</h3>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                    {getStatusIcon(document.status)}
                    <span className="ml-1 capitalize">{document.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Actions */}
            <div className="flex space-x-2">
              {(document.status !== 'verified') && (
                <div className="flex-1">
                  <input
                    type="file"
                    id={`file-input-${index}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      console.log("file",file);
                      if (file) {
                        setSelectedFile(file);
                        setSelectedDocument(document);
                        handleUpload(document.name);
                      }
                    }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor={`file-input-${index}`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer inline-block text-center"
                  >
                    {document.status !== 'pending' ? 'Re-upload Document' : 'Upload Document'}
                  </label>
                </div>
              )}
              
              {document.link && (
                <button
                  onClick={() => handleViewDocument(document)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </button>
              )}
            </div>

            {/* Remarks */}
            {document.remark && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Remark:</strong> {document.remark}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>


      {/* View Document Modal */}
      {showViewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDocument(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedDocument.status)}`}>
                  {getStatusIcon(selectedDocument.status)}
                  <span className="ml-2 capitalize">{selectedDocument.status}</span>
                </div>
              </div>

              {selectedDocument.link && (
                <div className="mb-4">
                  <button
                    onClick={() => handleDownloadDocument(selectedDocument)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download Document
                  </button>
                </div>
              )}

              {selectedDocument.remark && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Admin Remark:</h4>
                  <p className="text-gray-700">{selectedDocument.remark}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
