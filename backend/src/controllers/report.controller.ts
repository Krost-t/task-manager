import Task from '../models/Task.js';
import User from '../models/User.js';
import excelJS from 'exceljs';
import type { Request, Response } from 'express';



const exportTasksHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
            { header: 'Task ID', key: '_id', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user: any) => `${user.name} (${user.email})`).join(', ');
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split('T')[0],
                assignedTo: assignedTo || 'Unassigned',
            });
        })

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx');
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const exportUsersHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.find().select('name email_id').lean();
        const userTasks = await Task.find().populate(
            "assignedTo",
            "name email _id"
        )

        const userTaskMap: Record<string, any> = {}
        user.forEach((user) =>{
            userTaskMap[String(user._id)] = {
                name:user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks:0,
                completedTasks:0,
            }
        })

        userTasks.forEach((task)=>{
            if(task.assignedTo){
                task.assignedTo.forEach((assignedUser) =>{
                    const key = String(assignedUser._id)
                    if(userTaskMap[key]){
                        userTaskMap[key].taskCount +=1
                        if(task.status === "Pending"){
                            userTaskMap[key].pendingTasks+=1
                        }else if(task.status === "In-Progress"){
                            userTaskMap[key].inProgressTasks +=1
                        }else if (task.status === "Completed"){
                            userTaskMap[key].completedTasks +=1
                        }
                    }
                })
            }
        })

        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet("User Task Report")

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Task", key: "taskCount", width: 30 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 }
        ]

        Object.keys(userTaskMap).forEach((user) => {
            worksheet.addRow(user)
        })

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=user_task_report.xlsx")
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end()
        })

        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export { exportTasksHandler, exportUsersHandler}