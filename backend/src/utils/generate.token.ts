import jwt from "jsonwebtoken";
import type { Response } from "express";

const generateToken = (userId: string, res: Response): string => {
    const expiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN!, 10)

    const payload: { id: string } = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: `${expiresInDays}d`,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: expiresInDays * 24 * 60 * 60 * 1000,
    })
    return token;
};

export { generateToken };