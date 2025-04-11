import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";
import { User, UserRegistration, UserRepository } from "./domain/User";
import { Project, ProjectCreation, ProjectRepository } from "./domain/Project";
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

app.post("/api/edit-user-info", async (req: Request, res: Response) => {
  // incoming: user id
  // outgoing: all the user info

  const { id } = req.body;
  const db = driver;

  const theUser = await db.userRepository.GetById(id);

  // more specific error based on email OR password
  if (theUser == null) {
    return res.status(400).json({ error: "User not found!" });
  }

  // the same as getting the user up to this point, then get into editing it
    // 

  res.status(200).json(theUser);
});

// TODO search users

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
    return res.status(400).json({ error: "Project ID error!" });
  }

  if (theProject == null) {
    return res.status(400).json({ error: "Project not found!" });
  }

  res.status(200).json(theProject);
});

// Project edit
app.post("/api/edit-project", async (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(400).json({ error: "Invalid request format" });
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.projectRepository.Update(id, updates);

    if (!success) {
        return res
            .status(400)
            .json({ error: "Project not found or no changes made" });
    }

    let theProject;
    try {
        theProject = await db.projectRepository.GetById(id);
    } catch {
        return res.status(400).json({ error: "Invalid ID format!" });
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

    projects = projects.filter((project) => project.is_public);

    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving projects." });
  }
});

app.post("/api/get-all-users", async (req: Request, res: Response) => {
    // incoming: name
    // outgoing: all the users
  
    // optional parameters
    const db = driver;
  
    try {
      let users = await db.userRepository.GetAll();
      // now get rid of any private ones
      users = users.filter((user) => !user.isPrivate);
  
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Error retrieving users." });
    }
  });

app.post("/api/create-project", async (req: Request, res: Response, next: NextFunction) => {

    // Allows user to create project
    
    // Required parameters passed:
    /*
        name: string
        is_public: boolean
        creatorId: string
    */
    const { name, is_public, creator_id,
    description,required_skills, member_ids, applications, github_link, discord_link
    } = req.body;
    const db = driver;

    // Check for the required parameters
    if (!name) return res.status(400).json({ error: "Project name is required" });
    if (!is_public) return res.status(400).json({ error: "Project visibility is required" });
    if (!creator_id) return res.status(400).json({ error: "Creator's userId is required" });

    // Creation stuff
    const newProject = new ProjectCreation(name, is_public, creator_id,
    description,required_skills, member_ids, applications, github_link, discord_link);
    const enterProject = await db.projectRepository.Create(newProject);

    res.status(200).json({ success: "Project created!"});
});

// Project applications

// RESTRICTED TO PROJECT CREATOR ONLY // TODO Figure out how to apply that
app.post("/api/see-applications", async (req: Request, res: Response, next: NextFunction) => {
    // Returns list of user profiles that have applied to a specific project that
    // the user has created
    const db = driver;

    // 

});

app.post("/api/create-application", async (req: Request, res: Response, next: NextFunction) => {
    // Creates a new project to join a project

    // Passed
    /*
        userId: string
        projectId: string
        message: string
    */
    const { userId, projectId, message } = req.body;
    const db = driver;
});

app.get("/api/see-sent-applications", async (req: Request, res: Response) => {
    // Return list of projects that "I" have personally applied to

    // So this is based off users, so we need a userId passed in
    const { userId } = req.body;
    const db = driver;

    // Find project applications by userId
});

// RESTRICTED FOR CREATOR OF THE PROJECT ONLY // TODO Clarify how this is applied
app.post("/api/approve-application", async (req: Request, res: Response, next: NextFunction) => {
    // Accept or deny application to the project
    
    const db = driver;
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
