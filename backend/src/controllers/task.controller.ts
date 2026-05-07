import type { Request, Response } from 'express';
import Task from '../models/Task.js';



 const getTasksHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.query;
        const filter: { status?: 'Pending' | 'In-Progress' | 'Completed' } = {};

        if (status === 'Pending' || status === 'In-Progress' || status === 'Completed') {
            filter.status = status;
        }

        let tasks;

        if ((req as any).user.role === 'admin') {
            tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl')
        }else {
            tasks = await Task.find({ ...filter, assignedTo: (req as any).user._id }).populate('assignedTo', 'name email profileImageUrl')
        }

        tasks = await Promise.all(tasks.map(async (task) => {
            const completedCount = task.todoChecklist.filter((item) => item.completed).length;
            return { ...task.toObject(), completedTodoCount:completedCount };
        }));

        const allTasks = await Task.countDocuments((req as any).user.role === 'admin' ? {} : { assignedTo: (req as any).user._id });

        const pedingTasks = await Task.countDocuments({
            ...filter,
            ...(req as any).user.role !== 'admin' && { assignedTo: (req as any).user._id }
        })

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            ...(req as any).user.role !== 'admin' && { assignedTo: (req as any).user._id }
        })

        const completedTasks = await Task.countDocuments({
            ...filter,
            ...(req as any).user.role !== 'admin' && { assignedTo: (req as any).user._id }
        })

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pedingTasks,
                inProgressTasks,
                completedTasks,
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
 }

 const getTaskByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
 }

const createTaskHandler = async (req: Request, res: Response): Promise<void> => {
     try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

        if(!Array.isArray(assignedTo) ) {
            res.status(400).json({ message: 'assignedTo must be an array' });
            return;
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: (req as any).user._id,
            attachments,
            todoChecklist
        })

        res.status(201).json({message: "Task created successfully", task});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const updateTaskHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.attachments = req.body.attachments || task.attachments;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

        if(req.body.assignedTo) {
            if(!Array.isArray(req.body.assignedTo) ) {
                res.status(400).json({ message: 'assignedTo must be an array' });
                return;
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({message: "Task updated successfully", updatedTask});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const deleteTaskHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const updateTaskStatusHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        const isAssigned = task.assignedTo.some(userId => userId.toString() === (req as any).user._id.toString());

        if ((req as any).user.role !== 'admin' && !isAssigned) {
            res.status(403).json({ message: 'Forbidden: You can only update status of tasks assigned to you' });
            return;
        }

        task.status = req.body.status || task.status;

        if(task.status === 'Completed') {
            task.progress = 100;
            task.todoChecklist.forEach(item => item.completed = true);
        }
        await task.save();
        res.status(200).json({message: "Task status updated successfully", task});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const updateTaskCheklistHandler = async (req: Request, res: Response): Promise<void> => {
    try {
       const { todoChecklist } = req.body;
       const task = await Task.findById(req.params.id);
       if(!task){
        res.status(404).json({ message: 'Task not found' });
        return;
       }
       if(!task.assignedTo.includes((req as any).user._id) && (req as any).user.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: You can only update checklist of tasks assigned to you' });
        return;
       }
       task.todoChecklist = todoChecklist;

       const completedCount = task.todoChecklist.filter((item) => item.completed).length;
       const totalItems = task.todoChecklist.length;
       task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

       if(task.progress == 100){
        task
       }else if (task.progress > 0){
        task.status = 'In-Progress';
       }else{
        task.status = 'Pending';
       }

       await task.save();
       const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');

       res.status(200).json({message: "Task checklist updated successfully", updatedTask});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const getDashboardData = async (_req: Request, res: Response): Promise<void> => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

        const taskStatuses = ['Pending', 'In-Progress', 'Completed'];

        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution =taskStatuses.reduce((acc: Record<string, number>, status) => {
            const formattedKey = status.replace(/\s+/g, '');
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        },{})

        taskDistribution["All"] = totalTasks;

        const taskPriorities = ['Low', 'Medium', 'High'];
        const taskPrioritiesRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPrioritylevels = taskPriorities.reduce((acc: Record<string, number>, priority) => {
            acc[priority] = taskPrioritiesRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

       const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select('title status createdAt');

       res.status(200).json({
        statistics:{
            totalTasks,
            pendingTasks,
           completedTasks,
           overdueTasks,
        },
        charts: {
            taskDistribution,
            taskPrioritylevels
        },
        recentTasks
       })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

const getUserDashboardData = async (req: Request, res: Response): Promise<void> => {
       try {
        const userId = (req as any).user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ assignedTo: userId, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

        const taskStatueses = ['Pending', 'In-Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
         ])

        const taskDistribution = taskStatueses.reduce((acc: Record<string, number>, status) => {
            const formattedKey = status.replace(/\s+/g, '');
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        },{})
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ['Low', 'Medium', 'High'];
        const taskPrioritiesRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
         ]);

         const taskPrioritylevels = taskPriorities.reduce((acc: Record<string, number>, priority) => {
            acc[priority] = taskPrioritiesRaw.find(item => item._id === priority)?.count || 0;
            return acc;
         }, {});

         const recentTasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 }).limit(10).select('title status createdAt');

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPrioritylevels
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export { getDashboardData, getUserDashboardData, getTasksHandler, getTaskByIdHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler, updateTaskStatusHandler, updateTaskCheklistHandler }