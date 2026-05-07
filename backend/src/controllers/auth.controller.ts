import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generate.token.js";



const registerHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
        }

        let role: 'member' | 'admin'|'user' = 'member';
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = 'admin';
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });

        const token = generateToken(user.id, res);
        res.status(201).json({
            message: 'User created successfully',
            _id: user.id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' , error: error instanceof Error ? error.message : 'Unknown error'  });
    }
}

const loginHandler = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user.id, res);
        res.status(200).json({
            message: 'Login successful',
            _id: user.id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token
        });

    } catch (error) {
            res.status(500).json({ message: 'Server error' , error: error instanceof Error ? error.message : 'Unknown error'  });
    }
}

const getUserHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById((req as any).user.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' , error: error instanceof Error ? error.message : 'Unknown error'  });
    }
 }

const updateUserHandler = async (req: Request, res: Response): Promise<void> => { 
    try {
        const user = await User.findById((req as any).user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        const token = generateToken(updatedUser.id, res);

        res.json({
            message: 'User updated successfully',
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImageUrl: updatedUser.profileImageUrl,
            role: updatedUser.role,
            token,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' , error: error instanceof Error ? error.message : 'Unknown error'  });
    }
}

const uploadProfileImageHandler = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
}

export { registerHandler, loginHandler, getUserHandler, updateUserHandler, uploadProfileImageHandler }