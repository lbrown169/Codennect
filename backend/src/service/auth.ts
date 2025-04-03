import bcrypt from "bcrypt";

const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)

export async function HashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
