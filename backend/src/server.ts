import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { User, UserRegistration, UserRepository } from "./domain/User";
import { getVersion, isProd } from "./utils";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

config();

let driver = loadDatabaseDriver();

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
    res.status(201).json({ error: "User registered successfully!" });
});

app.post("/api/get-user-info", async (req, res) => {
    // incoming: user id
    // outgoing: all the user info

    const { id } = req.body;
    const db = driver;

    const theUser = await db.userRepository.GetById(id);

    // more specific error based on email OR password
    if (theUser == null) {
        return res.status(400).json({ error: "User not found!" });
    }

    res.status(200).json(theUser);
});

// app.post("/api/edit-user-info", async (req, res) => {
//   // incoming: user id
//   // outgoing: all the user info

//   const { id } = req.body;
//   const db = driver;

//   const theUser = await db.userRepository.GetById(id);

//   // more specific error based on email OR password
//   if (theUser == null) {
//     return res.status(400).json({ error: "User not found!" });
//   }

//   // the same as getting the user up to this point, then get into editing it
//     //

//   res.status(200).json(theUser);
// });

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

if (isProd()) {
    console.info("[PROD] Codennect web launching...");
} else {
    console.info("[DEV] Codennect web launching...");
}
console.info("Running on version " + getVersion());

app.listen(5001);
