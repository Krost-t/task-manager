import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LuFileSpreadsheet } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { downloadFile } from '../../utils/helper'
import { STATUS_DATA } from '../../utils/data'
import type { StatusSummary, Task } from '../../utils/types'

const ManageTask = () => {
  useUserAuth()

  const navigate = useNavigate()

  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [tabs, setTabs] = useState<{ label: string, count: number }[]>([])
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const controller = new AbortController()

    const getAllTasks = async () => {
      try {
        const status = STATUS_DATA.find((item) => item.label === filterStatus)?.value || ''
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
          params: { status },
          signal: controller.signal,
        })

        setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

        const statusSummary: StatusSummary | undefined = response.data?.statusSummary
        setTabs([
          { label: 'All', count: statusSummary?.all || 0 },
          { label: 'Pending', count: statusSummary?.pendingTasks || 0 },
          { label: 'In Progress', count: statusSummary?.inProgressTasks || 0 },
          { label: 'Completed', count: statusSummary?.completedTasks || 0 },
        ])
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Error fetching tasks:', error)
      }
    }

    getAllTasks()

    return () => controller.abort()
  }, [filterStatus])

  const handleClick = (taskData: Task) => {
    navigate('/admin/create-task', { state: { taskId: taskData._id } })
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: 'blob',
      })
      downloadFile(response.data, 'task_details.xlsx')
    } catch (error) {
      console.error('Error downloading task report:', error)
      toast.error('Failed to download task report. Please try again.')
    }
  }

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>

            <button className="flex lg:hidden card-btn" onClick={handleDownloadReport}>
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button className="hidden lg:flex card-btn" onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((item) => (
            <TaskCard key={item._id} task={item} onClick={() => handleClick(item)} />
          ))}
        </div>

        {allTasks.length === 0 && (
          <p className="text-sm text-gray-500 mt-6">No tasks found.</p>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageTask
