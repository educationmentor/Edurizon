import React, { useState,useEffect } from 'react'
import DocumentLayout from '@/components/admin/DocumentLayout'
import AdminTable from '@/components/admin/AdminTable';
import { TransitionLink } from '@/utils/TransitionLink';
import GridViewIcon from '@mui/icons-material/GridView';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
const navItems = [
    {
      href: "/admin/digital",
      icon: <GridViewIcon />,
      label: "Overview",
    }
  ]

const DigitalTeam = () => {
    const [searchTerm, setSearchTerm] = useState('');
     // Table Data
    
    const [adminData, setAdminData] = useState<any>(null);
    useEffect(() => {
        if(sessionStorage.getItem('adminData')){
          const value = sessionStorage.getItem('adminData');
          const parsedValue = JSON.parse(value || '{}');
          setAdminData(parsedValue);
        }else{
          const value = localStorage.getItem('adminData');
          const parsedValue = JSON.parse(value || '{}');
          setAdminData(parsedValue);
        }
      }, []);
    

    return (
    <div>
      <DocumentLayout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <div>
            {
                adminData?.role=='super-admin'?<SuperAdminTable/>:<MemberTable adminData={adminData}/>
            }
        </div>
        </DocumentLayout>
    </div>
  )
}

const SuperAdminTable: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allVideos, setAllVideos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all videos from all digital marketing admins
    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/api/admin/getAllDigitalVideos`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (response.data.success) {
                    // Sort by creation date (newest first)
                    const sortedVideos = response.data.videos.sort((a: any, b: any) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setAllVideos(sortedVideos);
                }
            } catch (error) {
                console.error('Error fetching all videos:', error);
                setError('Failed to fetch videos');
            } finally {
                setLoading(false);
            }
        };

        fetchAllVideos();
    }, []);

    const platformOptions = [
        'YouTube',
        'Instagram',
        'Facebook',
        'TikTok',
        'LinkedIn',
        'Twitter',
        'Other'
    ];

    const tableHeaders = [
        "S.No",
        "Admin Name",
        "Video Name",
        "Date of Shoot",
        "Video Edited",
        "Thumbnail Created",
        "Caption Added",
        "Video Uploaded",
        'Date of Upload',
        'Platform',
        'Description',
        'Created Date'
    ];
      
    const csvHeader = [
        'Admin Name',
        'Video Name',
        'Date of Shoot',
        'Video Edited',
        'Thumbnail Created',
        'Caption',
        'Video Uploaded',
        'Date of Upload',
        'Platform',
        'Description',
        'Created Date'
    ];
      
    const csvDataFields = [
        'adminName',
        'videoName',
        'dateOfShoot',
        'videoEdited',
        'thumbnailUploaded',
        'captionAdded',
        'videoUploaded',
        'uploadDate',
        'platform',
        'description',
        'createdAt'
    ];

    const tableColumns = [
        {
            key: "sno",
            render: (video: any, index: number) => index + 1,
        },
        {
            key: "adminName",
            render: (video: any) => (
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                        {video.adminName || 'Unknown Admin'}
                    </div>
                </div>
            ),
        },
        {
            key: "name",
            render: (video: any) => (
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{video.videoName}</div>
                </div>
            ),
        },
        {
            key: "dateOfShoot",
            render: (video: any) => (
                <span className="text-sm text-gray-500">
                    {video.dateOfShoot ? new Date(video.dateOfShoot).toLocaleDateString() : 'Not set'}
                </span>
            ),
        },
        {
            key: "videoEdited",
            render: (video: any) => (
                <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        video.videoEdited 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {video.videoEdited ? 'Yes' : 'No'}
                    </span>
                </div>
            ),
        },
        {
            key: "thumbnailUploaded",
            render: (video: any) => (
                <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        video.thumbnailUploaded 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {video.thumbnailUploaded ? 'Yes' : 'No'}
                    </span>
                </div>
            ),
        },
        {
            key: "captionAdded",
            render: (video: any) => (
                <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        video.captionAdded 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {video.captionAdded ? 'Yes' : 'No'}
                    </span>
                </div>
            ),
        },
        {
            key: "videoUploaded",
            render: (video: any) => (
                <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        video.videoUploaded 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {video.videoUploaded ? 'Yes' : 'No'}
                    </span>
                </div>
            ),
        },
        {
            key: "uploadDate",
            render: (video: any) => (
                <span className="text-sm text-gray-500">
                    {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : 'Not set'}
                </span>
            ),
        },
        {
            key: "platform",
            render: (video: any) => (
                <span className="text-sm text-gray-600">
                    {video.platform && video.platform.length > 0 ? video.platform.join(', ') : 'Not set'}
                </span>
            ),
        },
        {
            key: "description",
            render: (video: any) => (
                <span className="text-sm text-gray-600 max-w-xs truncate" title={video.description}>
                    {video.description || 'No description'}
                </span>
            ),
        },
        {
            key: "createdAt",
            render: (video: any) => (
                <span className="text-sm text-gray-500">
                    {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
            ),
        },
    ];

    const [activeTab, setActiveTab] = useState('allVideos');

    const tabs = [
        { key: "allVideos", label: "All Digital Marketing Videos", count: allVideos.length },
    ];

    // Filter videos based on search term
    const filteredVideos = allVideos.filter(video => 
        video.videoName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.platform?.some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className='m-[32px] rounded-[8px] text-center bg-white py-[16px] px-[8px] shadow-sm'>
            Coming Soon
    </div>
    );
};

const MemberTable: React.FC<{adminData:any}> = ({adminData}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videos, setVideos] = useState<any[]>(adminData?.digitalMarketingVideos || []);
    const [editingVideo, setEditingVideo] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<any>(null);
    const [formData, setFormData] = useState({
        videoName: '',
        dateOfShoot: '',
        videoEdited: false,
        thumbnailUploaded: false,
        captionAdded: false,
        videoUploaded: false,
        uploadDate: '',
        platform: [],
        description: ''
    });

    // Update videos when adminData changes
    useEffect(() => {
        if (adminData?.digitalMarketingVideos && adminData.digitalMarketingVideos.length > 0) {
            setVideos(adminData.digitalMarketingVideos);
            console.log('Videos loaded from adminData:', adminData.digitalMarketingVideos);
        } else {
            console.log('No videos found in adminData:', adminData);
            setVideos([]);
        }
    }, [adminData]);

    // Debug: Log adminData structure
    useEffect(() => {
        console.log('AdminData received:', adminData);
        console.log('AdminData keys:', adminData ? Object.keys(adminData) : 'No adminData');
        console.log('DigitalMarketingVideos:', adminData?.digitalMarketingVideos);
    }, [adminData]);

    const platformOptions = [
        'YouTube',
        'Instagram',
        'Facebook',
        'TikTok',
        'LinkedIn',
        'Twitter',
        'Other'
    ];

    const tableHeaders = [
        "S.No",
        "Video Name",
        "Date of Shoot",
        "Video Edited",
        "Thumbnail Created",
        "Caption Added",
        "Video Uploaded",
        'Date of Upload',
        'Platform',
        'Description',
        'Actions'
      ];
      
    const csvHeader = [
        'Video Name',
        'Date of Shoot',
        'Video Edited',
        'Thumbnail Created',
        'Caption',
        'Video Uploaded',
        'Date of Upload',
        'Platform',
        'Description'
      ];
      
      const csvDataFields = [
        'videoName',
        'dateOfShoot',
        'videoEdited',
        'thumbnailUploaded',
        'captionAdded',
        'videoUploaded',
        'uploadDate',
        'platform',
        'description'
      ];

      const tableColumns = [
        {
          key: "sno",
            render: (video: any, index: number) => index + 1,
        },
        {
          key: "name",
            render: (video: any) => (
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900">{video.videoName}</div>
            </div>
          ),
        },
        {
          key: "dateOfShoot",
            render: (video: any) => (
                <span className="text-sm text-gray-500">
                    {video.dateOfShoot ? new Date(video.dateOfShoot).toLocaleDateString() : 'Not set'}
                </span>
          ),
        },
        {
          key: "videoEdited",
            render: (video: any) => (
                <input
                    type="checkbox"
                    checked={video.videoEdited || false}
                    onChange={(e) => handleInstantUpdate(video._id, 'videoEdited', e.target.checked)}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
            ),
        },
        {
            key: "thumbnailUploaded",
            render: (video: any) => (
                <input
                    type="checkbox"
                    checked={video.thumbnailUploaded || false}
                    onChange={(e) => handleInstantUpdate(video._id, 'thumbnailUploaded', e.target.checked)}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
            ),
        },
        {
            key: "captionAdded",
            render: (video: any) => (
                <input
                    type="checkbox"
                    checked={video.captionAdded || false}
                    onChange={(e) => handleInstantUpdate(video._id, 'captionAdded', e.target.checked)}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
            ),
        },
        {
            key: "videoUploaded",
            render: (video: any) => (
                <input
                    type="checkbox"
                    checked={video.videoUploaded || false}
                    onChange={(e) => handleInstantUpdate(video._id, 'videoUploaded', e.target.checked)}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
            ),
        },
        {
            key: "uploadDate",
            render: (video: any) => (
                <span className="text-sm text-gray-500">
                    {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : 'Not set'}
                </span>
          ),
        },
        {
            key: "platform",
            render: (video: any) => (
                <select
                    value={video.platform || []}
                    onChange={(e) => handleInstantUpdate(video._id, 'platform', e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="">Select Platform</option>
                    {platformOptions.map((platform) => (
                        <option key={platform} value={platform}>{platform}</option>
                    ))}
                </select>
          ),
        },
        {
            key: "description",
            render: (video: any) => (
                <input
                    type="text"
                    value={video.description || ''}
                    onChange={(e) => handleInstantUpdate(video._id, 'description', e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter description"
                />
          ),
        },
        {
            key: "actions",
            render: (video: any) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                        title="Edit Video"
                    >
                        <EditIcon style={{ fontSize: '20px' }} />
                    </button>
                <button
                        onClick={() => handleDeleteClick(video)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                        title="Delete Video"
              >
                        <DeleteIcon style={{ fontSize: '20px' }} />
              </button>
            </div>
          ),
        },
        ];

        const [activeTab, setActiveTab] = useState('allStudents');

   const tabs = [
        { key: "allStudents", label: "All Videos", count: videos.length },
    ];

    // Handle instant updates for boolean fields and text
    const handleInstantUpdate = async (videoId: string, field: string, value: any) => {
        // Update local state immediately for instant feedback
        setVideos(prevVideos => 
            prevVideos.map(video => 
                video._id === videoId 
                    ? { ...video, [field]: value }
                    : video
            )
        );

        // Send update to backend in background (non-blocking)
        try {
            const response = await axios.patch(`${baseUrl}/api/admin/updateVideoData/${adminData._id}`, {
                videoId,
                [field]: value
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            // Update adminData in localStorage after successful update
            const updatedAdminData = {
                ...adminData,
                digitalMarketingVideos: videos.map(video => 
                    video._id === videoId 
                        ? { ...video, [field]: value }
                        : video
                )
            };
            
            // Update localStorage
            if (sessionStorage.getItem('adminData')) {
                sessionStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            } else {
                localStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            }
            
            console.log(`${field} updated successfully`);
        } catch (error) {
            console.error('Error updating video:', error);
            // Revert local state on error
            setVideos(prevVideos => 
                prevVideos.map(video => 
                    video._id === videoId 
                        ? { ...video, [field]: !value }
                        : video
                )
            );
        }
    };

    // Handle edit button click
    const handleEdit = (video: any) => {
        setEditingVideo(video);
        setFormData({
            videoName: video.videoName || '',
            dateOfShoot: video.dateOfShoot ? new Date(video.dateOfShoot).toISOString().split('T')[0] : '',
            videoEdited: video.videoEdited || false,
            thumbnailUploaded: video.thumbnailUploaded || false,
            captionAdded: video.captionAdded || false,
            videoUploaded: video.videoUploaded || false,
            uploadDate: video.uploadDate ? new Date(video.uploadDate).toISOString().split('T')[0] : '',
            platform: video.platform || [],
            description: video.description || ''
        });
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (video: any) => {
        setVideoToDelete(video);
        setShowDeleteModal(true);
    };

    // Handle form input changes
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle form submission for edit
    const handleUpdate = async () => {
        try {
            setLoading(true);
            
            const response = await axios.patch(`${baseUrl}/api/admin/updateVideoData/${adminData._id}`, {
                videoId: editingVideo._id,
                ...formData
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            // Update local state
            setVideos(prevVideos => 
                prevVideos.map(video => 
                    video._id === editingVideo._id 
                        ? { ...video, ...formData }
                        : video
                )
            );

            // Update adminData in localStorage after successful update
            const updatedAdminData = {
                ...adminData,
                digitalMarketingVideos: videos.map(video => 
                    video._id === editingVideo._id 
                        ? { ...video, ...formData }
                        : video
                )
            };
            
            // Update localStorage
            if (sessionStorage.getItem('adminData')) {
                sessionStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            } else {
                localStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            }

            setShowEditModal(false);
            setEditingVideo(null);
            console.log('Video updated successfully');
        } catch (error) {
            console.error('Error updating video:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDelete = async () => {
        try {
            setLoading(true);
            
            const response = await axios.delete(`${baseUrl}/api/admin/deleteVideoData/${adminData._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                data: {
                    videoId: videoToDelete._id
                }
            });

            // Remove from local state
            setVideos(prevVideos => 
                prevVideos.filter(video => video._id !== videoToDelete._id)
            );

            // Update adminData in localStorage after successful deletion
            const updatedAdminData = {
                ...adminData,
                digitalMarketingVideos: videos.filter(video => video._id !== videoToDelete._id)
            };
            
            // Update localStorage
            if (sessionStorage.getItem('adminData')) {
                sessionStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            } else {
                localStorage.setItem('adminData', JSON.stringify(updatedAdminData));
            }

            setShowDeleteModal(false);
            setVideoToDelete(null);
            console.log('Video deleted successfully');
        } catch (error) {
            console.error('Error deleting video:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle add new video
    const handleAdd = async () => {
        try {
            setLoading(true);
            console.log(formData);
            const response = await axios.patch(`${baseUrl}/api/admin/addVideoData/${adminData._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const newVideo = response.data;
            if (sessionStorage.getItem('adminData')) {
              sessionStorage.setItem('adminData', JSON.stringify(response.data.user));
            } else {
                localStorage.setItem('adminData', JSON.stringify(response.data.user));
            }
            // Add to local state
            setVideos(prevVideos => [...prevVideos, newVideo]);

            // Update adminData in localStorage after successful addition
            const updatedAdminData = {
                ...adminData,
                digitalMarketingVideos: [...videos, newVideo]
            };
            
            // Update localStorage
            

            setShowAddModal(false);
            setFormData({
                videoName: '',
                dateOfShoot: '',
                videoEdited: false,
                thumbnailUploaded: false,
                captionAdded: false,
                videoUploaded: false,
                uploadDate: '',
                platform: [],
                description: ''
            });
            console.log('Video added successfully');
        } catch (error) {
            console.error('Error adding video:', error);
        } finally {
            setLoading(false);
        }
    };
      
return (
        <div className='m-[32px] rounded-[8px] bg-white py-[16px] px-[8px] shadow-sm'>
            <div className="flex justify-between items-center px-[32px]">
                <h3 className="text-h6Text font-bold font-poppins">Digital Marketing Videos</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center"
                >
                    <AddIcon style={{ fontSize: '20px' }} className="mr-2" />
                    Add Video
                </button>
            </div>
            <div className=' m-[16px] rounded-[8px] overflow-hidden shadow-sm'>
            <AdminTable 
                ITEMS_PER_PAGE={10} 
                tableColumns={tableColumns} 
                tableHeaders={tableHeaders} 
                csvHeader={csvHeader} 
                csvDataFields={csvDataFields} 
                loading={loading} 
                error={error} 
                leads={videos} 
                setActiveTab={setActiveTab} 
                tabs={tabs} 
                activeTab={activeTab} 
                bgColor="bg-gray-50"
            />
            </div>

            {/* Add Video Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Video Name</label>
                                <input
                                    type="text"
                                    value={formData.videoName}
                                    onChange={(e) => handleInputChange('videoName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Enter video name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Shoot</label>
                                <input
                                    type="date"
                                    value={formData.dateOfShoot}
                                    onChange={(e) => handleInputChange('dateOfShoot', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.videoEdited}
                                        onChange={(e) => handleInputChange('videoEdited', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Video Edited</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.thumbnailUploaded}
                                        onChange={(e) => handleInputChange('thumbnailUploaded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Thumbnail Created</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.captionAdded}
                                        onChange={(e) => handleInputChange('captionAdded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Caption Added</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.videoUploaded}
                                        onChange={(e) => handleInputChange('videoUploaded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Video Uploaded</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                                <input
                                    type="date"
                                    value={formData.uploadDate}
                                    onChange={(e) => handleInputChange('uploadDate', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => handleInputChange('platform', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">Select Platform</option>
                                    {platformOptions.map((platform) => (
                                        <option key={platform} value={platform}>{platform}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Enter video description"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Video'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Video Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Edit Video</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Video Name</label>
                                <input
                                    type="text"
                                    value={formData.videoName}
                                    onChange={(e) => handleInputChange('videoName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Shoot</label>
                                <input
                                    type="date"
                                    value={formData.dateOfShoot}
                                    onChange={(e) => handleInputChange('dateOfShoot', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.videoEdited}
                                        onChange={(e) => handleInputChange('videoEdited', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Video Edited</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.thumbnailUploaded}
                                        onChange={(e) => handleInputChange('thumbnailUploaded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Thumbnail Created</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.captionAdded}
                                        onChange={(e) => handleInputChange('captionAdded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Caption Added</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.videoUploaded}
                                        onChange={(e) => handleInputChange('videoUploaded', e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Video Uploaded</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                                <input
                                    type="date"
                                    value={formData.uploadDate}
                                    onChange={(e) => handleInputChange('uploadDate', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => handleInputChange('platform', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">Select Platform</option>
                                    {platformOptions.map((platform) => (
                                        <option key={platform} value={platform}>{platform}</option>
                                    ))}
                                </select>
                            </div>

    <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Video'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Delete Video</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{videoToDelete?.videoName}"? This action cannot be undone.
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete Video'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
    );
};

export default DigitalTeam
