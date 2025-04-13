import Mailgun from "mailgun.js";
import FormData from "form-data";
import bcrypt from "bcrypt";

export function loadTransporter() {
    if (!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN)) {
        return null;
    }

    const mailgun = new Mailgun(FormData);

    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });

    return mg;
}
// import jwt from "jsonwebtoken";

const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)

export async function HashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// // Function to generate a JWT token
// export function generateToken(userId: string): string {
//     return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "1h",
//     });
// }

// // Middleware to verify JWT token
// import { Request, Response, NextFunction } from "express";

// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
//         (req as any).userId = decoded.userId; // Attach userId to request object
//         next();
//     } catch (err) {
//         res.status(403).json({ error: "Invalid token." });
//     }
// }
