import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { getProfile } from "./domain/User";
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
app.post("/api/register", async (req, res) => {
  
  const { email } = req.body;
  const db = driver;

  // Check for email, then see if one ties to a user
  if (!email) return res.status(400).json({ error: "Email is required" });

  // make sure there's not already a user with this login
  const existingUser = await db.userRepository.GetByEmail(email);

  // if there is one, send an error
  // TODO Update to check for a "verified" flag within the user
  if (existingUser != null) {
    return res.status(400).json({ error: "User already exists!" });
  }

  // create new user instance
  const newUser = new UserRegistration("", email, "");

  // insert the new user into the database using UserRepo
  const registeredUser = await db.userRepository.Register(newUser);

  // return a successful registration message
  //res.status(201).json({ log : "User email saved. Generating verification email." });

  // Next up, the email

  // Generate a simple random token
  const token = crypto.randomBytes(32).toString("hex");

  // Store the token and email temporarily
  tokenStore[token] = { email, expires: Date.now() + 15 * 60 * 1000 }; // Expires in 15 mins

  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });

  console.log("Verification email sent: %s", info.messageId);

  res.json({ message: "Verification email sent." });
});

// Route to verify token
app.get("/api/verify-email", async (req, res) => {
  const { token } = req.query;
  const db = driver;

  const record = tokenStore[token];
  if (!record) {
    return res.status(400).send("Invalid or expired token.");
  }

  // Optional: Check for token expiration
  if (record.expires < Date.now()) {
    delete tokenStore[token];
    return res.status(400).send("Token expired.");
  }

  // At this point, email is verified
  const verifiedEmail = record.email;
  delete tokenStore[token];

  //res.send(`Email ${verifiedEmail} has been successfully verified! Proceed to complete your registration.`);

  // Part 2: Finish registration
  const verifiedUser = await db.userRepository.GetByEmail(verifiedEmail);

  const { name, password } = req.body;
  // TODO Set new name and password

});

app.post("/api/login", async (req, res, next) => {
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

// TODO Split up register into two pieces: Part 1 Email -> Verify, Part 2 Set up password + info

/*
app.post("/api/register", async (req, res, next) => {
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
  res.status(201).json({ log : "User registered successfully!" });
});
*/

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
