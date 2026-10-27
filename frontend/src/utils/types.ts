export type TaskStatus = 'Pending' | 'In-Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TodoItem {
    _id?: string
    text: string
    completed: boolean
}

export interface AssignedUser {
    _id: string
    name: string
    email: string
    profileImageUrl?: string | null
}

export interface Task {
    _id: string
    title: string
    description?: string
    priority: TaskPriority
    status: TaskStatus
    dueDate: string
    assignedTo: AssignedUser[]
    createdBy?: string
    attachments: string[]
    todoChecklist: TodoItem[]
    progress: number
    completedTodoCount?: number
    createdAt?: string
    updatedAt?: string
}

export interface StatusSummary {
    all: number
    pendingTasks: number
    inProgressTasks: number
    completedTasks: number
}

export interface TeamMember extends AssignedUser {
    role: 'admin' | 'user' | 'member'
    pendingTask: number
    inProgressTask: number
    completedTask: number
}

export type DashboardCharts = {
  taskDistribution?: {
    All?: number;
    Pending?: number;
    InProgress?: number;
    Completed?: number;
  };
  taskPriorityLevels?: {
    Low?: number;
    Medium?: number;
    High?: number;
  };
};

export type DashboardData = {
  charts?: DashboardCharts;
  recentTasks?: Task[];
  statistics?: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
};
