 const BASE_URL: string =  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const  API_PATHS = {
    AUTH: {
        LOGIN: `/api/auth/login`,
        REGISTER: `/api/auth/register`,
        GET_PROFILE: `/api/auth/profile`
    },
    USERS: {
        GET_ALL_USERS: `/api/users`,
        GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`,
    },
    TASKS: {
        GET_DASHBOARD_DATA: `/api/tasks/dashboard-data`,
        GET_USER_DASHBOARD_DATA: `/api/tasks/user-dashboard-data`,
        GET_ALL_TASKS: `/api/tasks`,
        GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`,
        CREATE_TASK: `/api/tasks`,
        UPDATE_TASK: (taskId: string) =>`/api/tasks/${taskId}`,
        DELETE_TASK: (taskId: string) =>`/api/tasks/${taskId}`,

        UPDATE_TASK_STATUS: (taskId: string) =>`/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId: string) =>`/api/tasks/${taskId}/todo`,
    },
    REPORTS: {
        EXPORT_TASKS: `/api/reports/export/tasks`,
        EXPORT_USERS: `/api/reports/export/users`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/api/auth/upload-profile-image`,
    }
}

export{API_PATHS,BASE_URL}
