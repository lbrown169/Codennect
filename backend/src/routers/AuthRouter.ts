import express, { Request } from "express";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

import { UserRegistration } from "../domain/User.js";
import { buildUrl, Response } from "../utils.js";
import { Driver } from "../repo/Driver.js";

const AuthRouter = express.Router();

const JWT_EXPIRES_IN = "1h";

// Route to accept email and send verification
AuthRouter.post("/api/register", async (req: Request, res: Response) => {
    const { email } = req.body;
    const db: Driver = req.app.locals.driver;

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
    if (req.app.locals.transporter) {
        let message = `
        Hey there ${email},<br /><br />

        You're almost there! Click <a href="${verificationLink}">here</a> to finish your registration.
        `;
        const info = await req.app.locals.transporter.messages.create(
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
    res.json({ message: "Verification email sent." });
});

// Route to verify token
AuthRouter.post("/api/verify-email", async (req: Request, res: Response) => {
    // This is why we need the token in the database
    const { token, name, email, password } = req.body;
    const db: Driver = req.app.locals.driver;

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

AuthRouter.post("/api/login", async (req: Request, res: Response) => {
    // incoming: email, password
    // outgoing: id, name, error

    var error = "";
    const { email, password } = req.body;
    const db: Driver = req.app.locals.driver;

    const theUser = await db.userRepository.GetByEmailAndPassword(
        email,
        password
    );

    // more specific error based on email OR password
    if (theUser == null) {
        res.status(400).json({ error: "User not found!" });
        return;
    }

    const token = jwt.sign(
        { _id: theUser._id },
        process.env.JWT_SECRET_KEY || "your-secret-key",
        {
            expiresIn: JWT_EXPIRES_IN,
        }
    );

    // Cookie res
    res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        maxAge: 3600000,
    });

    res.json({ id: theUser._id, name: theUser.name, error: "" });
});

AuthRouter.post("/api/logout", async (req: Request, res: Response) => {
    if (res.locals.user) {
        res.clearCookie("token");
    }

    res.status(204).json();
});

export default AuthRouter;
