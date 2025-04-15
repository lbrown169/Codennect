import { Request as ProjectRequest, RequestType } from "src/domain/Request.js";
import express, { Request } from "express";
import { Driver } from "../repo/Driver.js";
import { Response } from "../utils.js";

const RequestRouter = express.Router();

RequestRouter.post("/api/requests", async (req: Request, res: Response) => {
    // Creates new application to join a project
    // Passed: user_id, projectId, message (all strings)
    if (!res.locals.user) {
        res.status(401).json({
            error: "Unauthorized. You must be logged in to perform this action.",
        });
        return;
    }

    const { user_id, project_id, is_invite, roles, message } = req.body;
    const db: Driver = req.app.locals.driver;
    const project = await db.projectRepository.GetById(project_id);

    if (!project) {
        res.status(400).json({
            error: "Bad request. Provided project does not exist.",
        });
        return;
    }

    if (is_invite) {
        // Is an invite, we need to make sure authenticated user is the owner
        if (project.owner !== res.locals.user._id) {
            res.status(403).json({
                error: "Forbidden. Only project owners can create invites.",
            });
            return;
        }
    } else {
        // It's an application, ensure user_id is logged in ID
        if (user_id !== res.locals.user._id) {
            res.status(403).json({
                error: "Forbidden. You cannot create an application on someone else's behalf.",
            });
            return;
        }
    }

    if ([user_id, project_id, is_invite, roles].includes(undefined)) {
        res.status(400).json({
            error: "Bad request. user_id, project_id, is_invite, and roles are required.",
        });
        return;
    }

    if (!Array.isArray(roles) || roles.length == 0) {
        res.status(400).json({
            error: "Bad request. Roles must be an array greater than size 0.",
        });
        return;
    }

    const newRequest = await db.requestRepository.CreateRequest(
        new ProjectRequest(
            project_id,
            user_id,
            is_invite ? RequestType.INVITE : RequestType.APPLICATION,
            roles,
            message
        )
    );
    res.status(200).json({
        success: "Request sent!",
        request: newRequest,
    });
});

RequestRouter.post(
    "/api/requests/approve",
    async (req: Request, res: Response) => {
        if (!res.locals.user) {
            res.status(401).json({
                error: "Unauthorized. You must be logged in to perform this action.",
            });
            return;
        }
        const { user_id, project_id, is_invite } = req.body;
        const db: Driver = req.app.locals.driver;
        const request = await db.requestRepository.GetRequest(
            user_id,
            project_id,
            is_invite
        );

        if (!request) {
            res.status(400).json({
                error: "Bad request. Request not found.",
            });
            return;
        }

        const user = await db.userRepository.GetById(user_id);
        const project = await db.projectRepository.GetById(project_id);

        if (!user) {
            res.status(400).json({
                error: "Bad request. Provided user not found.",
            });
            return;
        }

        if (!project) {
            res.status(400).json({
                error: "Bad request. Provided project not found.",
            });
            return;
        }

        if (is_invite) {
            // It's an invite, it must be the user who is accepting the invite
            if (res.locals.user._id !== user_id) {
                res.status(403).json({
                    error: "Forbidden. Only the user receiving the invite can approve it.",
                });
                return;
            }
        } else {
            // Application, only the project owner can accept it
            if (res.locals.user._id !== project.owner) {
                res.status(403).json({
                    error: "Forbidden. Only the project owner can approve an application.",
                });
                return;
            }
        }

        // Remove them from any roles they are currently in
        for (let role in project.users) {
            project.users[role] = project.users[role].filter(
                (user) => user !== user_id
            );
        }

        // Place them into their assigned roles
        for (let role in request.roles) {
            if (!project.users[role]) {
                project.users[role] = [];
            }
            project.users[role].push(user_id);
        }

        // Now insert project id into user
        if (user.projects.indexOf(project_id) === -1) {
            user.projects.push(project_id);
            await db.userRepository.Update(user_id, {
                projects: user.projects,
            });
        }

        await db.projectRepository.Update(project_id, { users: project.users });
    }
);
