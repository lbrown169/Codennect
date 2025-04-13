import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import { loadDatabaseDriver } from "./repo/Driver.js";
import { loadTransporter } from "./service/auth.js";
import { UserRegistration } from "./domain/User.js";
import { getVersion, isProd, buildUrl } from "./utils.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path, { dirname } from "path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import { sign, verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key"; // Store secret in env variable
const JWT_EXPIRES_IN = "1h";
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// dotenv.config();
config();

let driver = loadDatabaseDriver();
let transporter = loadTransporter();

// Route to accept email and send verification
app.post("/api/register", async (req: Request, res: Response) => {
    const { email } = req.body;
    const db = driver;

    // Check for email, then see if one ties to a user
    if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }

    // make sure there's not already a registered user with this login
    const existingUser = await db.userRepository.GetByEmail(email);
    if (existingUser != null) {
        // Silently fail to not expose existing user
        res.json({ message: "Verification email sent." });
        return;
    }

    // Enter user into verification purgatory and don't register until verification is complete
    await db.verificationRepository.DeleteVerification(email); // Delete if applicable
    const token = randomBytes(32).toString("hex"); // Generate token
    const notYetUser = await db.verificationRepository.RegisterVerification(
        email,
        token
    ); // Add

    // Link to email
    const verificationLink = buildUrl(`/verify-email?token=${token}`);
    // Email
    if (transporter) {
        let message = `
        Hey there ${email},<br /><br />

        You're almost there! Click <a href="${verificationLink}">here</a> to finish your registration.
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
        console.log("Verification email sent.", info);
    } else {
        console.info(
            "Mailgun credentials were not specified, verification link:"
        );
        console.info(verificationLink);
    }

    // Finish
    res.json({ message: "Verification email sent." });
});

// Route to verify token
app.post("/api/verify-email", async (req: Request, res: Response) => {
    // This is why we need the token in the database
    const { token, name, email, password } = req.body;
    const db = driver;

    // Check that name and password are valid entries
    if (!name || !password) {
        res.status(400).send("Invalid name or password.");
        return;
    }

    // Validate token
    const verifyAttempt = await db.verificationRepository.ValidateVerification(
        email,
        token
    );
    if (!verifyAttempt) {
        res.status(400).send("Invalid or expired token.");
        return;
    }

    // At this point, email is verified and we can register user
    const newUser = new UserRegistration(name, email, password);

    // insert the new user into the database using UserRepo
    const registeredUser = await db.userRepository.Register(newUser);
    const deleteVerification =
        await db.verificationRepository.DeleteVerification(email);

    // return a successful registration message
    res.status(201).json({ log: "User registered successfully!" });
});

app.post("/api/login", async (req: Request, res: Response) => {
    // incoming: email, password
    // outgoing: id, name, error

    var error = "";
    const { email, password } = req.body;
    const db = driver;

    const theUser = await db.userRepository.GetByEmailAndPassword(
        email,
        password
    );

    // more specific error based on email OR password
    if (theUser == null) {
        res.status(400).json({ error: "User not found!" });
        return;
    }

    res.status(200).json({ id: theUser._id, name: theUser.name, error: "" });
});

app.post("/api/get-user-info", async (req, res) => {
    // incoming: user id
    // outgoing: all the user info

    const { id } = req.body;
    const db = driver;

    const theUser = await db.userRepository.GetById(id);

    // more specific error based on email OR password
    if (theUser == null) {
        res.status(400).json({ error: "User not found!" });
        return;
    }

    res.status(200).json(theUser);
});

app.get("/api/get-me", async (req: AuthenticatedRequest, res: Response) => {
    // incoming: user id
    // outgoing: all the user info
    if (!req.fullUser) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }

    res.status(200).json(req.fullUser);
});

app.post("/api/edit-user-info", async (req: Request, res: Response) => {
    // incoming: user id, updates to user
    // format (within the json):
    // "id": "65a1b2c3d4e5f67890123456",
    // "updates": {
    //    "name": "New Name",
    //    "comm": "Updated Comm",
    //    "skills": ["JavaScript", "TypeScript"]
    // }
    // outgoing: all the user info

    const { id, updates } = req.body;
    const db = driver;

    if (!id || !updates || typeof updates !== "object") {
        res.status(400).json({ error: "Invalid request format" });
        return;
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.userRepository.Update(id, updates);

    if (!success) {
        res.status(400).json({ error: "User not found or no changes made" });
        return;
    }

    let theUser;
    try {
        theUser = await db.userRepository.GetById(id);
    } catch {
        res.status(400).json({ error: "Invalid ID format!" });
        return;
    }

    res.status(200).json({ success: true, updatedUser: theUser });
});

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

if (isProd()) {
    console.info("[PROD] Codennect web launching...");
} else {
    console.info("[DEV] Codennect web launching...");
}
console.info("Running on version " + getVersion());

app.listen(5001, () => console.log("Listening on 5001"));
