import { config } from "dotenv";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { loadDatabaseDriver } from "./repo/Driver.js";
import { loadTransporter } from "./service/auth.js";
import { User, UserRegistration } from "./domain/User.js";
import { ProjectCreation } from "./domain/Project.js";
import { getVersion, isProd, buildUrl } from "./utils.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path, { dirname } from "path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key"; // Store secret in env variable
const JWT_EXPIRES_IN = "1h";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.SIGNING_KEY));

let driver = loadDatabaseDriver();
let transporter = loadTransporter();

interface JwtPayload {
    _id: string;
}

interface Locals extends Record<string, any> {
    user?: User;
}

interface Response extends ExpressResponse {
    locals: Locals;
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = undefined;
    const token = req.signedCookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            res.locals.user = await driver.userRepository.GetById(decoded._id);
        } catch (err) {
            res.clearCookie("token");
        }
    }

    next();
});

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

// TODO search users
app.post("/api/get-all-users", async (req: Request, res: Response) => {
    // incoming: name
    // outgoing: all the users

    // optional parameters
    const db = driver;

    try {
        let users = await db.userRepository.GetAll();
        // now get rid of any private ones
        users = users.filter((user) => !user.isPrivate);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving users." });
    }
});

// Project stuff
app.post("/api/get-project-details", async (req: Request, res: Response) => {
    // incoming: project id
    // outgoing: all the project info

    const { id } = req.body;
    const db = driver;

    let theProject;
    try {
        theProject = await db.projectRepository.GetById(id);
    } catch {
        res.status(400).json({ error: "Project ID error!" });
        return;
    }

    if (theProject == null) {
        res.status(400).json({ error: "Project not found!" });
        return;
    }

    res.status(200).json(theProject);
});

// Project edit
app.post("/api/edit-project", async (req: Request, res: Response) => {
    // incoming: project id, updates to project
    // format (within the json):
    // "id": "65a1b2c3d4e5f67890123456",
    // "updates": {
    //      name: "New Name",
    //      is_public: "T/F",
    //      creator_id: THIS WILL NOT BE CHANGEABLE
    //      description: "Updated Description",
    //      required_skills: ["JavaScript", "TypeScript"]
    //      member_ids: ["JavaScript", "TypeScript"]
    //      applications: ["JavaScript", "TypeScript"]
    //      github_link: ["JavaScript", "TypeScript"]
    //      discord_link: ["JavaScript", "TypeScript"]
    // }
    //
    // outgoing: all the project info

    const { id, updates } = req.body; // TODO Double check with Logan that this works for updates
    const db = driver;

    if (!id || !updates || typeof updates !== "object") {
        res.status(400).json({ error: "Invalid request format" });
        return;
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.projectRepository.Update(id, updates);

    if (!success) {
        res.status(400).json({ error: "Project not found or no changes made" });
        return;
    }

    let theProject;
    try {
        theProject = await db.projectRepository.GetById(id);
    } catch {
        res.status(400).json({ error: "Invalid ID format!" });
        return;
    }

    res.status(200).json({ success: true, updatedProject: theProject });
});

app.post("/api/get-all-projects", async (req: Request, res: Response) => {
    // incoming: name/skill?
    // outgoing: all the projects
    // should be able to filter by name/skill

    // optional parameters
    const { name, required_skills } = req.body;
    const db = driver;

    try {
        // repo needs to implement some sort of getall
        let projects = await db.projectRepository.GetAll(); // get all first

        // Filter by name if provided
        if (name) {
            projects = projects.filter((project) =>
                project.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        // Filter by skill if provided
        if (required_skills) {
            projects = projects.filter((project) =>
                project.required_skills.includes(required_skills)
            );
        }

        projects = projects.filter((project) => !project.is_private);

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving projects." });
    }
});

app.post("/api/create-project", async (req: Request, res: Response) => {
    // Allows user to create project

    // Required parameters passed:
    /*
        name: string
        is_public: boolean
        creatorId: string
    */
    const {
        name,
        is_public,
        creator_id,
        description,
        required_skills,
        member_ids,
        applications,
        github_link,
        discord_link,
    } = req.body;
    const db = driver;

    // Check for the required parameters
    if (!name) res.status(400).json({ error: "Project name is required" });
    else if (!is_public)
        res.status(400).json({ error: "Project visibility is required" });
    else if (!creator_id)
        res.status(400).json({ error: "Creator's userId is required" });
    else {
        // Creation stuff
        const newProject = new ProjectCreation(
            name,
            is_public,
            creator_id,
            description,
            required_skills,
            member_ids,
            applications,
            github_link,
            discord_link
        );
        const enterProject = await db.projectRepository.Create(newProject);

        res.status(200).json({ success: "Project created!" });
    }
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

    const token = jwt.sign({ _id: theUser._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    // Cookie res
    res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        maxAge: 3600000,
    });

    res.json({ id: theUser._id, name: theUser.name, error: "" });
});

app.post("/api/logout", async (req: Request, res: Response) => {
    if (res.locals.user) {
        res.clearCookie("token");
    }

    res.status(204).json();
});

app.get("/api/get-user-info", async (req, res) => {
    // incoming: user id
    // outgoing: all the user info

    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }

    const { id } = req.body;
    const db = driver;

    const theUser = await db.userRepository.GetById(id);

    // more specific error based on email OR password
    if (theUser == null) {
        res.status(400).json({ error: "User not found!" });
        return;
    }

    res.status(200).json(theUser.toJson());
});

app.get("/api/get-me", async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info
    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }

    res.status(200).json(res.locals.user);
});

app.post("/api/edit-me", async (req: Request, res: Response) => {
    // incoming: user id, updates to user
    // format (within the json):
    // "updates": {
    //    "name": "New Name",
    //    "comm": "Updated Comm",
    //    "skills": ["JavaScript", "TypeScript"]
    // }
    // outgoing: all the user info

    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }

    const { updates } = req.body;
    const db = driver;

    if (!updates || typeof updates !== "object") {
        res.status(400).json({ error: "Invalid request format" });
        return;
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.userRepository.Update(
        res.locals.user._id,
        updates
    );

    if (!success) {
        res.status(400).json({ error: "User not found or no changes made" });
        return;
    }

    let theUser;
    try {
        theUser = await db.userRepository.GetById(res.locals.user._id);
    } catch {
        res.status(400).json({ error: "Invalid ID format!" });
        return;
    }

    res.locals.user = theUser;

    res.status(200).json({ success: true, updatedUser: theUser });
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
