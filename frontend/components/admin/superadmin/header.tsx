import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/lib/baseUrl'
import { TransitionLink } from '@/utils/TransitionLink'

const Header = () => {
  const [leadsCount, setLeadsCount] = useState(0)
  const [registeredStudentsCount, setRegisteredStudentsCount] = useState(0)
  const [universitiesCount, setUniversitiesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch leads count
      const leadsResponse = await axios.get(`${baseUrl}/api/leads/get-all`)

      if (leadsResponse.data.data) {
        setLeadsCount(leadsResponse.data.data.length)
      }

      // Fetch registered students count
      const studentsResponse = await axios.get(`${baseUrl}/api/registered-students/get-all`)
      
      if (studentsResponse.data) {
        setRegisteredStudentsCount(studentsResponse.data.length)
      }

      // Fetch partnered universities count
      const universitiesResponse = await axios.get(`${baseUrl}/api/partnered-universities`)
      if (universitiesResponse.data.success) {
        setUniversitiesCount(universitiesResponse.data.count)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full mb-6">
      {/* Metric Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {/* Total Students Leads Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Total Students Leads
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : leadsCount}
                </span>
              </div>
            </div>
            <button className="ml-4 bg-teal-600 hover:bg-teal-700 text-white w-[200px] h-[60px] font-bold py-2 rounded-lg text-smallText  transition-colors duration-200">
              View Leads
            </button>
          </div>
        </div>

        {/* Applications in Progress Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Applications in Progress
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : registeredStudentsCount}
                </span>
                <div className="w-20"></div> {/* Spacer for alignment */}
              </div>
            </div>
            <button className="ml-4 bg-teal-600 hover:bg-teal-700 text-white w-[200px] h-[60px] font-bold py-2 rounded-lg text-smallText transition-colors duration-200">
              Students
            </button>
          </div>
        </div>

        {/* Partner Universities Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Partner Universities
              </h3>
              <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : universitiesCount}
                </span>
                <div className="w-20"></div> {/* Spacer for alignment */}
              </div>
            </div>
            <TransitionLink href="/admin/superadmin/partnered-universities">
            <button className="ml-4 bg-teal-600 hover:bg-teal-700 text-white w-[200px] h-[60px] font-bold py-2 rounded-lg text-smallText transition-colors duration-200">
              View
            </button>
            </TransitionLink>
          </div>
        </div>
      </div>     
    </div>
  )
}

export default Header
