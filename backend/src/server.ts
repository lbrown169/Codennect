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

  let theUser;
  try {
    theUser = await db.userRepository.GetById(id);
  }
  catch {
    return res.status(400).json({ error: "Invalid ID format!" });
  }

  // error if the user is not found
  if (theUser == null) {
    return res.status(400).json({ error: "User not found!" });
  }

  res.status(200).json(theUser);
});

// app.post("/api/edit-user-info", async (req, res) => {
//   // incoming: user id
//   // outgoing: all the user info

//   const { id, editedField, change } = req.body;
//   const db = driver;

//   // TODO: SANITIZE ID INPUT
//     // copy from above once confirmed

//   const theUser = await db.userRepository.GetById(id);

//   // error if the user is not found
//   if (theUser == null) {
//     return res.status(400).json({ error: "User not found!" });
//   }

//   // the same as getting the user up to this point, then get into editing it
//   // use a switch statement to determine (from editedField) which field is being edited
//     // name, comm, skills, roles, interests
//   switch(editedField) { 
//     case "name": { 
//       //statements;
//       break; 
//     }
//     case "comm": { 
//       //statements; 
//       break; 
//     }
//     case "skills": { 
//       //statements; 
//       break; 
//     }
//     case "roles": { 
//       //statements; 
//       break; 
//     }
//     case "interests": { 
//       //statements; 
//       break; 
//     }
//     default: { 
//        //statements; 
//        break; 
//     } 
//   } 

//   res.status(200).json(theUser);
// });

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
);

app.listen(5001);
