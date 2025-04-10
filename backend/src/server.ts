import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { User, UserRegistration, UserRepository } from "./domain/User";
import { Project, ProjectRepository } from "./domain/Project";
import { Request, Response, NextFunction } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

config();

let driver = loadDatabaseDriver();

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
  // incoming: possibly name or skill
  // outgoing: all the info for a certain project

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


// project stuff
// app.post("/api/get-project-details", async (req: Request, res: Response) => {
//   // incoming: project id
//   // outgoing: all the project info

//   const { id } = req.body;
//   const db = driver;

//   let theProject;
//   try {
//     // TODO: CHANGE TO PROJECT REPO
//     theProject = await db.projectRepository.GetById(id);
//   } catch {
//     return res.status(400).json({ error: "Project ID error!" });
//   }

//   if (theProject == null) {
//     return res.status(400).json({ error: "Project not found!" });
//   }

//   res.status(200).json(theProject);
// });

// app.post("/api/get-all-projects", async (req: Request, res: Response) => {
//   // incoming: name/skill?
//   // outgoing: all the projects
//     // should be able to filter by name/skill

//   // optional parameters
//   const { name, skills } = req.body;
//   const db = driver;

//   try {
//     // repo needs to implement some sort of getall
//     let projects = await db.projectRepository.GetAll(); // get all first

//     // Filter by name if provided
//     if (name) {
//       projects = projects.filter((project) =>
//         project.name.toLowerCase().includes(name.toLowerCase())
//       );
//     }

//     // Filter by skill if provided
//     if (skills) {
//       projects = projects.filter((project) =>
//         project.skills.includes(skills)
//       );
//     }

//     return res.status(200).json(projects);
//   } catch (err) {
//     return res.status(500).json({ error: "Error retrieving projects." });
//   }
// });


app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
