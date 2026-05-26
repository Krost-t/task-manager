 const BASE_URL: string =  import.meta.env.VITE_API_URL;;

const  API_PATHS = {
    AUTH: {
        LOGIN: `/auth/login`,
        REGISTER: `/auth/register`,
        GET_PROFILE: `/auth/profile`
    },
    USERS: {
        GET_ALL_USERS: `/users`,
        GET_USER_BY_ID: (userId: string) => `/users/${userId}`,
        CREATE_USER: `/users`,
        UPDATE_USER: (userId: string) =>`/users/${userId}`,
        DELETE_USER: (userId: string) =>`/users/${userId}`,
    },
    TASKS: {
        GET_DASHBOARD_DATA: `/tasks/dashboard-stats`,
        GET_USER_DASHBOARD_DATA: `/tasks/user-dashboard-data`,
        GET_ALL_TASKS: `/tasks`,
        GET_TASK_BY_ID: (taskId: string) => `/tasks/${taskId}`,
        CREATE_TASK: `/tasks`,
        UPDATE_TASK: (taskId: string) =>`/tasks/${taskId}`,
        DELETE_TASK: (taskId: string) =>`/tasks/${taskId}`,

        UPDATE_TASK_STATUS: (taskId: string) =>`/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId: string) =>`/tasks/${taskId}/todo`,
    },
    REPORTS: {
        EXPORT_TASKS: `/reports/export/tasks`,
        EXPORT_USERS: `/reports/export/users`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/auth/upload-profile-image`,
    }
}

export{API_PATHS,BASE_URL}