import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import { countryOptions } from '@/lib/adminData';

interface PartneredUniversity {
  _id: string;
  universityName: string;
  country: string;
  city: string;
  studentsServed: number;
  createdAt: string;
  updatedAt: string;
}

const PartneredUniversitiesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [universities, setUniversities] = useState<PartneredUniversity[]>([]);
  const [currentDataForTable, setCurrentDataForTable] = useState<PartneredUniversity[]>([]);
  
  // Popup and modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<PartneredUniversity | null>(null);
  const [selectedUniversities, setSelectedUniversities] = useState<PartneredUniversity[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    universityName: '',
    country: '',
    city: '',
    studentsServed: 0
  });
  
  // Filter states
  const [filterCriteria, setFilterCriteria] = useState({
    universityName: '',
    country: '',
    city: ''
  });

  // Table configuration
  const tableHeaders = [
    "S.No",
    "University Name",
    "Country",
    "City",
    "Students Served",
    "Created Date",
    "Actions"
  ];

  const csvHeader = [
    'University Name',
    'Country',
    'City',
    'Students Served',
    'Created Date'
  ];

  const csvDataFields = [
    'universityName',
    'country',
    'city',
    'studentsServed',
    'createdAt'
  ];

  const tableColumns = [
    {
      key: "sno",
      render: (university: PartneredUniversity, index: number) => index + 1,
    },
    {
      key: "universityName",
      render: (university: PartneredUniversity) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{university.universityName}</div>
        </div>
      ),
    },
    {
      key: "country",
      render: (university: PartneredUniversity) => (
        <span className="text-sm text-gray-500">{university.country || 'N/A'}</span>
      ),
    },
    {
      key: "city",
      render: (university: PartneredUniversity) => (
        <span className="text-sm text-gray-500">{university.city || 'N/A'}</span>
      ),
    },
    {
      key: "studentsServed",
      render: (university: PartneredUniversity) => (
        <span className="text-sm text-gray-500">{university.studentsServed || 0}</span>
      ),
    },
    {
      key: "createdDate",
      render: (university: PartneredUniversity) => (
        <span className="text-sm text-gray-500">
          {new Date(university.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
      ),
    },
    {
      key: "actions",
      render: (university: PartneredUniversity) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(university)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <ModeEditOutlineOutlinedIcon style={{ fontSize: '20px' }} />
          </button>
          <button
            onClick={() => handleDelete(university._id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <DeleteOutlinedIcon style={{ fontSize: '20px' }} />
          </button>
        </div>
      ),
    }
  ];

  // Fetch universities data
  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    setCurrentDataForTable(universities);
  }, [universities]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/partnered-universities`);
      if (response.data.success) {
        setUniversities(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching universities:', error);
      setError(error.response?.data?.message || 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'studentsServed' ? parseInt(value) || 0 : value
    }));
  };

  // Handle add university
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/partnered-universities`, formData);
      if (response.data.success) {
        setShowAddModal(false);
        setFormData({ universityName: '', country: '', city: '', studentsServed: 0 });
        fetchUniversities();
        alert('University added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding university:', error);
      alert(error.response?.data?.message || 'Failed to add university');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit university
  const handleEdit = (university: PartneredUniversity) => {
    setSelectedUniversity(university);
    setFormData({
      universityName: university.universityName,
      country: university.country,
      city: university.city,
      studentsServed: university.studentsServed
    });
    setShowEditModal(true);
  };

  // Handle update university
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniversity) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        `${baseUrl}/api/partnered-universities/${selectedUniversity._id}`,
        formData
      );
      if (response.data.success) {
        setShowEditModal(false);
        setSelectedUniversity(null);
        setFormData({ universityName: '', country: '', city: '', studentsServed: 0 });
        fetchUniversities();
        alert('University updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating university:', error);
      alert(error.response?.data?.message || 'Failed to update university');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete university
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`${baseUrl}/api/partnered-universities/${id}`);
      if (response.data.success) {
        fetchUniversities();
        alert('University deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting university:', error);
      alert(error.response?.data?.message || 'Failed to delete university');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUniversities.length === 0) {
      alert('Please select universities to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedUniversities.length} selected university(ies)?`)) {
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const university of selectedUniversities) {
        try {
          const response = await axios.delete(`${baseUrl}/api/partnered-universities/${university._id}`);
          if (response.data.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
          console.error('Error deleting university:', university._id, err);
        }
      }

      if (successCount > 0) {
        alert(`Successfully deleted ${successCount} university(ies)${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        setSelectedUniversities([]);
        fetchUniversities();
      } else {
        setError(`Failed to delete any universities. ${errorCount} errors occurred.`);
      }
    } catch (err: any) {
      setError('Failed to delete universities');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter universities
  const filterUniversities = () => {
    let filteredData = [...universities];
    
    if (filterCriteria.universityName) {
      filteredData = filteredData.filter(university => 
        university.universityName.toLowerCase().includes(filterCriteria.universityName.toLowerCase())
      );
    }
    
    if (filterCriteria.country) {
      filteredData = filteredData.filter(university => 
        university.country?.toLowerCase() === filterCriteria.country.toLowerCase()
      );
    }
    
    if (filterCriteria.city) {
      filteredData = filteredData.filter(university => 
        university.city?.toLowerCase() === filterCriteria.city.toLowerCase()
      );
    }
    
    setCurrentDataForTable(filteredData);
    setShowFilterModal(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterCriteria({
      universityName: '',
      country: '',
      city: ''
    });
    setCurrentDataForTable(universities);
    setShowFilterModal(false);
    setSelectedUniversities([]);
  };

  // Handle university selection
  const handleUniversitySelection = (university: PartneredUniversity, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUniversities(prev => [...prev, university]);
    } else {
      setSelectedUniversities(prev => prev.filter(u => u._id !== university._id));
    }
  };

  return (
    <AdminLayout>
      <div className='m-[32px] rounded-[8px] bg-white py-[16px] px-[8px] shadow-sm'>
        <div className='flex justify-between items-center px-[32px]'>
          <h4 className='text-h6Text font-medium font-poppins'>Partner Universities</h4>
          <div className='flex items-center gap-[16px]'>
            <button 
              onClick={() => setShowFilterModal(true)}
              className={`text-[#344054] text-[14px] px-[4px] py-2 rounded-[8px] hover:bg-gray-100 flex items-center ${
                Object.values(filterCriteria).some(value => value !== '') ? 'bg-teal-100 border border-teal-300' : ''
              }`}
            >
              <FilterListOutlinedIcon style={{ fontSize: '20px' }} />
              <span className='ml-[4px]'>Filter</span>
              {Object.values(filterCriteria).some(value => value !== '') && (
                <span className='ml-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full'>
                  {Object.values(filterCriteria).filter(value => value !== '').length}
                </span>
              )}
            </button>
            <button 
              onClick={handleBulkDelete}
              disabled={selectedUniversities.length === 0}
              className={`text-[#344054] text-[14px] px-[4px] py-2 rounded-[8px] hover:bg-gray-100 flex items-center ${
                selectedUniversities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <DeleteOutlinedIcon style={{ fontSize: '20px' }} />
              <span className='ml-[4px]'>Delete ({selectedUniversities.length})</span>
            </button>
          </div>
        </div>

        <div className='m-[16px] rounded-[8px] overflow-hidden shadow-sm'>
          <AdminTable 
            ITEMS_PER_PAGE={10} 
            tableColumns={tableColumns} 
            tableHeaders={tableHeaders} 
            csvHeader={csvHeader} 
            csvDataFields={csvDataFields} 
            loading={loading} 
            error={error} 
            leads={currentDataForTable} 
            setActiveTab={() => {}} 
            tabs={[]} 
            activeTab="" 
            bgColor="bg-gray-50"
            setSelectedLead={(universityIds: string[]) => {
              const selectedUniversityObjects = universityIds.map((id: string) => 
                currentDataForTable.find(university => university._id === id)
              ).filter(Boolean) as PartneredUniversity[];
              setSelectedUniversities(selectedUniversityObjects);
            }}
            extraButtons={
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center"
              >
                <AddIcon style={{ fontSize: '20px' }} className="mr-2" />
                Add University
              </button>
            } 
          />
        </div>

        {/* Add University Modal */}
        {showAddModal && (
          <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="relative bg-white rounded-lg w-[90%] max-w-md p-6 m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New University</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name *</label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students Served</label>
                  <input
                    type="number"
                    name="studentsServed"
                    value={formData.studentsServed}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add University'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit University Modal */}
        {showEditModal && (
          <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="relative bg-white rounded-lg w-[90%] max-w-md p-6 m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit University</h2>
                <button onClick={() => {
                  setShowEditModal(false);
                  setSelectedUniversity(null);
                }} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name *</label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students Served</label>
                  <input
                    type="number"
                    name="studentsServed"
                    value={formData.studentsServed}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUniversity(null);
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update University'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="relative bg-white rounded-lg w-[90%] max-w-2xl p-6 m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filter Universities</h2>
                <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
                    <input
                      type="text"
                      value={filterCriteria.universityName}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, universityName: e.target.value }))}
                      placeholder="Search by name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={filterCriteria.country}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">All Countries</option>
                      {countryOptions.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={filterCriteria.city}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Search by city..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={filterUniversities}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-teal-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PartneredUniversitiesPage;
