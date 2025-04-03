import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { User, UserRegistration, UserRepository } from "./domain/User";

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
    if (theUser == null) {
        return res
            .status(400)
            .json({ error: "User with that email and password not found!" });
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

app.post("/api/edit-user-info", async (req, res) => {
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

app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
