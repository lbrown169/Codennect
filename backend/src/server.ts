import { config } from "dotenv";
import { Request, Response, NextFunction } from 'express';
import { loadDatabaseDriver } from "./repo/Driver";
import { loadTransporter } from "./service/auth";
import { User, UserRegistration, UserRepository } from "./domain/User";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto"); // generate token

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

config();

let driver = loadDatabaseDriver();
let transporter = loadTransporter();

// In-memory store for demo purposes (replace with DB or Redis in production)
const tokenStore = {};

// Route to accept email and send verification
app.post("/api/register", async (req: Request, res: Response) => {
  
  const { email } = req.body;
  const db = driver;

  // Check for email, then see if one ties to a user
  if (!email) return res.status(400).json({ error: "Email is required" });

  // make sure there's not already a registered user with this login
  const existingUser = await db.userRepository.GetByEmail(email);
  if (existingUser != null) {
    // Silently fail to not expose existing user
    return res.status(400).json({ message: "Verification email sent." });
  }

  // Enter user into verification purgatory and don't register until verification is complete
  await db.verificationRepository.DeleteVerification(email); // Delete if applicable
  const token = crypto.randomBytes(32).toString("hex"); // Generate token
  const notYetUser = db.verificationRepository.RegisterVerification(email, token); // Add

  // Link to email
  const verificationLink = `http://cop4331.tech/verify-email?token=${token}`;
  // Email
  const info = await transporter.sendMail({
    from: '"Codennect" <noreply.codennect@gmail.com>',
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });

  // Finish
  console.log("Verification email sent.", info.messageId);
  res.json({ message: "Verification email sent." });
});

// Route to verify token
app.post("/api/verify-email", async (req: Request, res: Response) => {
  // This is why we need the token in the database
  const { token, name, email, password } = req.body;
  const db = driver;

  // Check that name and password are valid entries
  if(!name || !password) {
    return res.status(400).send("Invalid name or password.");
  }

  // Validate token
  const verifyAttempt = await db.verificationRepository.ValidateVerification(email, token);
  if(!verifyAttempt) {
    return res.status(400).send("Invalid or expired token.");
  }

  // At this point, email is verified and we can register user
  const newUser = new UserRegistration(name, email, password);

  // insert the new user into the database using UserRepo
  const registeredUser = await db.userRepository.Register(newUser);
  const deleteVerification = await db.verificationRepository.DeleteVerification(email);

  // return a successful registration message
  res.status(201).json({ log : "User registered successfully!" });

});

app.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(400).json({ error: "User not found!" });
  }

  res.status(200).json({ id: theUser._id, name: theUser.name, error: "" });
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
