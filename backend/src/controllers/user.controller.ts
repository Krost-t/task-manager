import type { Request, Response } from 'express'
import User from '../models/User.js';
import Task from '../models/Task.js';


const getAllUsersHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({ role: 'member' }).select('-password');

        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTask = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
            const inProgressTask = await Task.countDocuments({ assignedTo: user._id, status: 'In-Progress' });
            const completedTask = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' });

            return {
                ...user.toObject(),
                pendingTask,
                inProgressTask,
                completedTask
            };
        }))
            
        res.status(200).json(usersWithTaskCount);
    } catch (error) {
       res.status(500).json({ message: 'Server error', /* error:error.message  */}); 
    }
}

const getUserByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', /* error:error.message  */});
    }
}



export { getAllUsersHandler, getUserByIdHandler }