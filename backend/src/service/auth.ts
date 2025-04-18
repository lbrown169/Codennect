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

// New home of the secret key
export function jwtKey() {
    return process.env.JWT_SECRET_KEY || "your-secret-key";
}

const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)

export async function HashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
