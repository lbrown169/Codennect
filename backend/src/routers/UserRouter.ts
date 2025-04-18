import express, { Request } from "express";
import { Driver } from "../repo/Driver.js";
import { Response } from "../utils.js";

const UserRouter = express.Router();

UserRouter.get("/api/get-me", async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info
    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }
    if (res.locals.user.verification) {
        res.status(412).json({
            error: "Active verification detected.",
        });
    }

    res.status(200).json({ error: "", result: res.locals.user });
});

UserRouter.post("/api/edit-me", async (req: Request, res: Response) => {
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
    if (res.locals.user.verification) {
        res.status(412).json({
            error: "Active verification detected.",
        });
    }

    const { updates } = req.body;
    const db: Driver = req.app.locals.driver;

    if (!updates || typeof updates !== "object") {
        res.status(400).json({ error: "Invalid request format", });
        return;
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.userRepository.Update(
        res.locals.user._id,
        updates
    );

    if (!success) {
        res.status(400).json({ error: "User not found or no changes made", });
        return;
    }

    let theUser;
    try {
        theUser = await db.userRepository.GetById(res.locals.user._id);
    } catch {
        res.status(400).json({ error: "Invalid ID format!", });
        return;
    }

    res.locals.user = theUser;

    res.status(200).json({ error: "", success: true, updatedUser: theUser });
});

UserRouter.get("/api/get-user-info", async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info

    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }
    if (res.locals.user.verification) {
        res.status(412).json({
            error: "Active verification detected.",
        });
    }

    const { id } = req.query;
    const db: Driver = req.app.locals.driver;

    if (!id) {
        res.status(400).json({
            error: "Field 'id' must be specified",
        });
        return;
    }

    const theUser = await db.userRepository.GetById(id.toString());

    // more specific error based on email OR password
    if (theUser == null) {
        res.status(400).json({ error: "User not found!", });
        return;
    }

    res.status(200).json({ error: "", result: theUser.toJson()});
});

UserRouter.get("/api/get-all-users", async (req: Request, res: Response) => {
    // incoming: name
    // outgoing: all the users

    // optional parameters
    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }
    if (res.locals.user.verification) {
        res.status(412).json({
            error: "Active verification detected.",
        });
    }
    const db: Driver = req.app.locals.driver;

    // add privacy limit here?

    try {
        let users = await db.userRepository.GetAll();
        res.status(200).json({ error: "", result: users.map((user) => user.toJson()) });
    } catch (err) {
        res.status(500).json({ error: "Error retrieving users.", });
    }
});

export default UserRouter;
