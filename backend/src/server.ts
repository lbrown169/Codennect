import { Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

import { getVersion, isProd, Response } from "./utils.js";
import { loadDatabaseDriver } from "./repo/Driver.js";
import { loadTransporter } from "./service/auth.js";

import AuthRouter from "./routers/AuthRouter.js";
import UserRouter from "./routers/UserRouter.js";
import ProjectRouter from "./routers/ProjectRouter.js";
import RequestRouter from "./routers/RequestRouter.js";

config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.SIGNING_KEY));

let driver = loadDatabaseDriver();
let transporter = loadTransporter();

app.locals.driver = driver;
app.locals.transporter = transporter;

interface JwtPayload {
    _id: string;
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = undefined;
    const token = req.signedCookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY || "your-secret-key"
            ) as JwtPayload;
            res.locals.user = await driver.userRepository.GetById(decoded._id);
        } catch (err) {
            res.clearCookie("token");
        }
    }

    next();
});

app.use(AuthRouter);
app.use(UserRouter);
app.use(ProjectRouter);
app.use(RequestRouter);

// password reset functionalitites
app.post("/api/send-password-reset", async (req: Request, res: Response) => {
    const { email } = req.body;
    const db = driver;

    // Check for email, then see if one ties to a user
    if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }

    // make sure there's already a registered user with this login
    const existingUser = await db.userRepository.GetByEmail(email);
    if (existingUser == null) {
        // no user found
        res.json({ message: "No user with this email." });
        return;
    }

    // Enter user into verification purgatory to store code
    await db.verificationRepository.DeleteVerification(email); // Delete if applicable
    // make a random 6 digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const stringCode = verificationCode.toString(); // turn to string
    const userBeingReset = await db.verificationRepository.RegisterVerification(
        email,
        stringCode
    );

    // Email
    if (transporter) {
        let message = `
        Hey there ${email},<br /><br />

        Here is your password verification code: ${verificationCode}.
        `;
        const info = await transporter.messages.create(
            process.env.MAILGUN_DOMAIN!,
            {
                from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [email],
                subject: "Verify your email",
                html: message,
            }
        );
        console.log("Password reset email sent.", info);
    } else {
        console.info(
            "Mailgun credentials were not specified, verification code:"
        );
        console.info(verificationCode);
    }
    res.json({ message: "Password reset email sent." });
});

// actually resets the password itself
app.post("/api/change-password", async (req: Request, res: Response) => {
    // This is why we need the code in the database
    const { verificationCode, email, newPassword } = req.body;
    const db = driver;

    // Check that the new password is a valid entry
    if (!newPassword) {
        res.status(400).send("Invalid name or password.");
        return;
    }

    // Validate token
    const verifyAttempt = await db.verificationRepository.ValidateVerification(
        email,
        verificationCode
    );
    if (!verifyAttempt) {
        res.status(400).send("Invalid or expired password verification code.");
        return;
    }

    // change the password
    const user = await db.userRepository.GetByEmail(email);
    if (user == null) {
        res.status(400).send("User with that email not found.");
        return;
    }

    // high chance of crashing here ngl
    const updateSuccess = await db.userRepository.UpdatePassword(user._id, newPassword);
    if (!updateSuccess) {
        res.status(400).send("Failed to update password.");
        return; 
    }

    // return a successful password change message
    res.status(201).json({ log: "Password changed successfully!" });
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

if (isProd()) {
    console.info("[PROD] Codennect web launching...");
} else {
    console.info("[DEV] Codennect web launching...");
}
console.info("Running on version " + getVersion());

app.listen(5001, () => console.log("Listening on 5001"));
