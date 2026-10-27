import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import SelectUsers from '../../components/Inputs/SelectUsers'
import TodoListInput from '../../components/Inputs/TodoListInput'
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'
import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { PRIORITY_DATA } from '../../utils/data'
import type { Task, TaskPriority, TodoItem } from '../../utils/types'

interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assignedTo: string[]
  todoChecklist: string[]
  attachments: string[]
}

const INITIAL_TASK_DATA: TaskFormData = {
  title: '',
  description: '',
  priority: 'Low',
  dueDate: '',
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
}

const TaskForm = ({ taskId }: { taskId?: string }) => {
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState<TaskFormData>(INITIAL_TASK_DATA)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }))
  }

  const clearData = () => {
    setTaskData(INITIAL_TASK_DATA)
  }

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return error.response.data.message as string
    }
    return 'An error occurred. Please try again.'
  }

  const createTask = async () => {
    setLoading(true)

    try {
      const todoList: TodoItem[] = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }))

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      })

      toast.success('Task Created Successfully')
      clearData()
    } catch (error) {
      console.error('Error creating task:', error)
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async () => {
    if (!taskId) return
    setLoading(true)

    try {
      const todoList: TodoItem[] = taskData.todoChecklist.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || []
        const matchedTask = prevTodoChecklist.find((task) => task.text === item)

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        }
      })

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      })

      toast.success('Task Updated Successfully')
    } catch (error) {
      console.error('Error updating task:', error)
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!taskData.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!taskData.description.trim()) {
      setError('Description is required.')
      return
    }
    if (!taskData.dueDate) {
      setError('Due date is required.')
      return
    }
    if (taskData.assignedTo.length === 0) {
      setError('Task not assigned to any member.')
      return
    }
    if (taskData.todoChecklist.length === 0) {
      setError('Add at least one todo task.')
      return
    }

    if (taskId) {
      updateTask()
      return
    }

    createTask()
  }

  useEffect(() => {
    if (!taskId) return

    const controller = new AbortController()

    const getTaskDetailsByID = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId), { signal: controller.signal })

        if (response.data) {
          const taskInfo: Task = response.data
          setCurrentTask(taskInfo)

          setTaskData({
            title: taskInfo.title,
            description: taskInfo.description || '',
            priority: taskInfo.priority,
            dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
            assignedTo: taskInfo.assignedTo?.map((item) => item._id) || [],
            todoChecklist: taskInfo.todoChecklist?.map((item) => item.text) || [],
            attachments: taskInfo.attachments || [],
          })
        }
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Error fetching task:', error)
      }
    }

    getTaskDetailsByID()

    return () => controller.abort()
  }, [taskId])

  const deleteTask = async () => {
    if (!taskId) return

    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))

      setOpenDeleteAlert(false)
      toast.success('Task deleted successfully')
      navigate('/admin/tasks')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <form className="form-card col-span-3" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>

              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value as TaskPriority)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>

                <input
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange('dueDate', target.value)}
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">Assign To</label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>

              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>

              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange('attachments', value)}
              />
            </div>

            {error && <p className="text-xs font-medium text-red-500 mt-5">{error}</p>}

            <div className="flex justify-end mt-7">
              <button type="submit" className="add-btn" disabled={loading}>
                {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  )
}

const CreateTask = () => {
  useUserAuth()

  const location = useLocation()
  const { taskId } = (location.state as { taskId?: string } | null) || {}

  return <TaskForm key={location.key} taskId={taskId} />
}

export default CreateTask
