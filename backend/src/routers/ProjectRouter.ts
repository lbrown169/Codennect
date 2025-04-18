import express, { Request } from "express";
import { Project, ProjectCreation } from "../domain/Project.js";
import { Driver } from "../repo/Driver.js";
import { Response } from "../utils.js";

const ProjectRouter = express.Router();

ProjectRouter.get(
    "/api/get-my-projects",
    async (req: Request, res: Response) => {
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

        let projects: Project[] = [];
        for (let pid of res.locals.user.projects) {
            let p = await db.projectRepository.GetById(pid);
            if (p) {
                projects.push(p);
            }
        }
        res.status(200).json({error: "", result: projects});
    }
);

ProjectRouter.get("/api/get-project", async (req: Request, res: Response) => {
    // incoming: project id
    // outgoing: all the project info

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

    if (!id) {
        res.status(400).json({
            error: "Field 'id' must be specified",
        });
        return;
    }

    const db: Driver = req.app.locals.driver;

    let theProject;
    try {
        theProject = await db.projectRepository.GetById(id.toString());
    } catch {
        res.status(400).json({ error: "Project ID error!", });
        return;
    }

    if (theProject == null) {
        res.status(400).json({ error: "Project not found!", });
        return;
    }

    res.status(200).json({ error: "", result: theProject });
});

ProjectRouter.post("/api/edit-project", async (req: Request, res: Response) => {
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

    const { id, updates } = req.body; // TODO Double check with Logan that this works for updates
    const db: Driver = req.app.locals.driver;

    if (!id || !updates || typeof updates !== "object") {
        res.status(400).json({ error: "Invalid request format", });
        return;
    }

    let project;
    try {
        project = await db.projectRepository.GetById(id);
    } catch {
        res.status(400).json({ error: "Invalid ID format!", });
        return;
    }

    if (!project || !res.locals.user.projects.includes(project._id)) {
        res.status(404).json({ error: "Project not found", });
        return;
    }

    if (project.owner !== res.locals.user._id) {
        res.status(403).json({
            error: "Only project owner can edit the project.",
        });
        return;
    }

    // Don't allow editing project members from this endpoint
    const { users, ...trimmed } = updates;

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    const success = await db.projectRepository.Update(id, trimmed);

    if (!success) {
        res.status(400).json({ error: "Project not found or no changes made", });
        return;
    }

    project = await db.projectRepository.GetById(id);

    res.status(200).json({ error: "", success: true, updatedProject: project });
});

ProjectRouter.get(
    "/api/get-all-projects",
    async (req: Request, res: Response) => {
        // incoming: name/skill?
        // outgoing: all the projects
        // should be able to filter by name/skill

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

        const { name, required_skills } = req.query;
        const db: Driver = req.app.locals.driver;

        try {
            // repo needs to implement some sort of getall
            let projects = await db.projectRepository.GetByPartialName(
                name ? name.toString() : ""
            ); // get all first

            // Filter by skill if provided
            if (required_skills) {
                let parsed = required_skills.toString().split(",");
                projects = projects.filter(
                    (project) =>
                        project.required_skills.filter((skill) =>
                            parsed.includes(skill)
                        ).length > 0
                );
            }

            res.status(200).json({ error: "", result: projects });
        } catch (err) {
            res.status(500).json({ error: "Error retrieving projects.", });
        }
    }
);

ProjectRouter.post(
    "/api/create-project",
    async (req: Request, res: Response) => {
        // Allows user to create project

        // Required parameters passed:
        /*
        name: string
        description: string
        isPrivate: boolean
    */
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
        const {
            name,
            description,
            isPrivate,
            required_skills,
            fields,
            roles,
        } = req.body;
        const db: Driver = req.app.locals.driver;

        // Check for the required parameters
        if ([name, description, isPrivate].includes(undefined)) {
            res.status(400).json({
                error: "Project name, description, and visibility is required",
            });
            return;
        }
        // Creation stuff
        const newProject = new ProjectCreation(
            name,
            "",
            res.locals.user?._id,
            isPrivate,
            description,
            fields,
            roles,
            {},
            required_skills
        );
        const enterProject = await db.projectRepository.Create(newProject);

        res.locals.user.projects.push(enterProject._id);

        await db.userRepository.Update(res.locals.user._id, {
            projects: res.locals.user.projects,
        });

        res.status(200).json({
            error: "",
            success: "Project created!",
            project: enterProject,
        });
    }
);

export default ProjectRouter;
