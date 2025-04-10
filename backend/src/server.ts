import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { User, UserRegistration, UserRepository } from "./domain/User";
import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import { generateToken } from "./service/auth";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Store secret in env variable
const JWT_EXPIRES_IN = '1h';
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// dotenv.config();
config();

let driver = loadDatabaseDriver();

app.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
    // incoming: email, password
    // outgoing: id, name, error

    var error = "";
    const { email, password } = req.body;
    const db = driver;

    const theUserEmail = await db.userRepository.GetByEmail(email);

    // make sure a user was found with that email
    // this is basically for testing and can be removed later
    if (theUserEmail == null) {
        return res
            .status(400)
            .json({ error: "User with that email not found!" });
    }

    // now try the password
    const theUser = await db.userRepository.GetByEmailAndPassword(
        email,
        password
    );

    // make sure a user was found with that email and password
    if (!theUser) {
        return res.status(400).json({ error: "User with that email and password not found!" });
    }

    // TODO Figure out JWT_SECRET_KEY
    const token = jwt.sign({ id: theUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Cookie res
    res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    // JS
    res.status(200).json({ id: theUser._id, name: theUser.name, error: "" });
});

// How to reassign to user (since user will not be const)
interface AuthenticatedRequest extends Request {
    user?: any;
}

// Powers the middleware
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Look for token in cookies or Authorization header (Bearer token)
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers.authorization;
    let token = tokenFromCookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
  
    if(token) {
        try {
        // Verify the token; returns the decoded payload if the token is valid.
        // TODO secret key stuffprocess
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Attach decoded information to the request
        req.user = decoded;
        next(); // Pass control to middleware handler

        } catch(err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    } else { // No token provided
      return res.status(401).json({ error: "Authentication token required" });
    }
};

// JWT cookie middleware
app.get('/api/protected', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    message: "This is protected data.",
    user: req.user,
  });
});

app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    // incoming: name, email, password
    // outgoing: id, error
    // return new credentials?

    var error = "";
    const { name, email, password } = req.body;
    const db = driver;

    // make sure there's not already a user with this login
    const existingUser = await db.userRepository.GetByEmail(email);

    // if there is one, send an error
    if (existingUser != null) {
        return res.status(400).json({ error: "User already exists!" });
    }

    // create new user instance
    const newUser = new UserRegistration(name, email, password);

    // insert the new user into the database using UserRepo
    const registeredUser = await db.userRepository.Register(newUser);

    // return a successful registration message
    res.status(201).json({ error: "User registered successfully!" });
});

app.post("/api/get-user-info", async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info

    const { id } = req.body;
    const db = driver;

    let theUser;
    try {
        theUser = await db.userRepository.GetById(id);
    } catch {
        return res.status(400).json({ error: "Invalid ID format!" });
    }

    // error if the user is not found
    if (theUser == null) {
        return res.status(400).json({ error: "User not found!" });
    }

    res.status(200).json(theUser);
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
        return res.status(400).json({ error: "Invalid request format" });
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.userRepository.Update(id, updates);

    if (!success) {
        return res
            .status(400)
            .json({ error: "User not found or no changes made" });
    }

    let theUser;
    try {
        theUser = await db.userRepository.GetById(id);
    } catch {
        return res.status(400).json({ error: "Invalid ID format!" });
    }

    res.status(200).json({ success: true, updatedUser: theUser });
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001, () => console.log("Listening on 5001"));
