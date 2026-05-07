import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req: Request, res: Response, next: Function): Promise<void> => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = await User.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }


}

const adminOnly = (req: Request, res: Response, next: Function): void => {
    if ((req as any).user && (req as any).user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden, admin only' });
    }
}

export { protectRoute, adminOnly }