import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuFileSpreadsheet } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import UserCard from '../../components/Cards/UserCard'
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { downloadFile } from '../../utils/helper'
import type { TeamMember } from '../../utils/types'

const ManageUsers = () => {
  useUserAuth()

  const [allUsers, setAllUsers] = useState<TeamMember[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const getAllUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, { signal: controller.signal })
        if (response.data?.length > 0) {
          setAllUsers(response.data)
        }
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Error fetching users:', error)
      }
    }

    getAllUsers()

    return () => controller.abort()
  }, [])

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: 'blob',
      })
      downloadFile(response.data, 'user_details.xlsx')
    } catch (error) {
      console.error('Error downloading user report:', error)
      toast.error('Failed to download user report. Please try again.')
    }
  }

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button className="flex md:flex card-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>

        {allUsers.length === 0 && (
          <p className="text-sm text-gray-500 mt-6">No team members yet.</p>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
