import express, { Request } from 'express';
import { Project, ProjectCreation, ProjectUsers } from '../domain/Project.js';
import { PossibleRoles, PossibleSkills } from '../domain/User.js';
import { Driver } from '../repo/Driver.js';
import { Response } from '../utils.js';
import checkVerification from '../middleware/checkVerification.js';

const ProjectRouter = express.Router();
ProjectRouter.use(checkVerification);

ProjectRouter.get('/api/projects', async (req: Request, res: Response) => {
    // incoming: name/skill?
    // outgoing: all the projects
    // should be able to filter by name/skill

    // optional parameters
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const { name, required_skills, roles } = req.query;
    const db: Driver = req.app.locals.driver;

    try {
        // get all non-private projects
        let projects = (
            await db.projectRepository.GetByPartialName(
                name ? name.toString() : ''
            )
        ).filter((project) => !project.isPrivate);

        // filter by roles if provided
        console.log('yo1');
        if (roles) {
            console.log('yo2');
            const parsedRoles = roles.toString().split(',');

            // validate roles
            const validRoles = parsedRoles.filter((role) =>
                PossibleRoles.includes(role)
            );

            projects = projects.filter((project) =>
                Object.keys(project.users).some((role) =>
                    validRoles.includes(role)
                )
            );
        }

        // Filter by skill if provided
        if (required_skills) {
            const parsedSkills = required_skills.toString().split(',');

            // validate skills
            const validSkills = parsedSkills.filter((skill) =>
                PossibleSkills.includes(skill)
            );

            projects = projects.filter((project) =>
                project.required_skills.some((skill) =>
                    validSkills.includes(skill)
                )
            );
        }

        res.status(200).json({ error: '', result: projects });
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving projects.' });
    }
});

ProjectRouter.get('/api/projects/me', async (req: Request, res: Response) => {
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const db: Driver = req.app.locals.driver;

    let projects: Project[] = [];
    for (let pid of res.locals.user.projects) {
        let p = await db.projectRepository.GetById(pid);
        if (p) {
            projects.push(p);
        }
    }
    res.status(200).json({ error: '', result: projects });
});

ProjectRouter.get('/api/projects/:id', async (req: Request, res: Response) => {
    // incoming: project id
    // outgoing: all the project info

    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const { id } = req.params;

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
        res.status(400).json({ error: 'Project ID error!' });
        return;
    }

    if (theProject == null) {
        res.status(400).json({ error: 'Project not found!' });
        return;
    }

    // if the project is public, return it
    if (!theProject.isPrivate) {
        res.status(200).json({ error: '', result: theProject });
        return;
    }

    const userId = res.locals.user._id;

    // check if the user is already a member of the project
    const isMember =
        Object.values(theProject.users).some((role) =>
            role.users.includes(userId)
        ) || theProject.owner === userId;
    if (isMember) {
        res.status(200).json({ error: '', result: theProject });
        return;
    }

    // check if the user has an application or invite to this project
    const userApplications = await db.requestRepository.GetUserApplications(
        userId
    );
    const userInvites = await db.requestRepository.GetUserInvites(userId);

    const hasApplied = userApplications.some((app) => app.project_id === id);
    const hasInvite = userInvites.some((invite) => invite.project_id === id);

    if (hasApplied || hasInvite) {
        res.status(200).json({ error: '', result: theProject });
        return;
    }

    // if private and no relation, block access
    res.status(403).json({
        error: 'You do not have permission to view this private project.',
    });
});

ProjectRouter.patch(
    '/api/projects/:id',
    async (req: Request, res: Response) => {
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
                error: 'Unauthorized. You must be logged in to perform this action.',
            });
            return;
        }

        const { id } = req.params;
        const { updates } = req.body; // TODO Double check with Logan that this works for updates
        const db: Driver = req.app.locals.driver;

        if (!id || !updates || typeof updates !== 'object') {
            res.status(400).json({ error: 'Invalid request format' });
            return;
        }

        let project;
        try {
            project = await db.projectRepository.GetById(id);
        } catch {
            res.status(400).json({ error: 'Invalid ID format!' });
            return;
        }

        if (!project || !res.locals.user.projects.includes(project._id)) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        if (project.owner !== res.locals.user._id) {
            res.status(403).json({
                error: 'Only project owner can edit the project.',
            });
            return;
        }

        // uses an update user function in the repo itself
        // function takes in id and the updates and handles it internally
        // all the roles and skills are validated in the update function
        const success = await db.projectRepository.Update(id, updates);

        if (!success) {
            res.status(400).json({
                error: 'Project not found or no changes made',
            });
            return;
        }

        project = await db.projectRepository.GetById(id);

        res.status(200).json({
            error: '',
            success: true,
            updatedProject: project,
        });
    }
);

ProjectRouter.post('/api/projects', async (req: Request, res: Response) => {
    // Allows user to create project

    // Required parameters passed:
    /*
        name: string
        description: string
        isPrivate: boolean
    */
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }
    const { name, description, isPrivate, required_skills, fields, users } =
        req.body;
    const db: Driver = req.app.locals.driver;

    // Check for the required parameters
    if ([name, description, isPrivate].includes(undefined)) {
        res.status(400).json({
            error: 'Project name, description, and visibility is required',
        });
        return;
    }

    const defaultUsers: ProjectUsers = {};
    for (let role of PossibleRoles) {
        defaultUsers[role] = {
            max: 0,
            users: [],
        };
        if (
            typeof users == 'object' &&
            role in users &&
            'max' in users[role] &&
            !Number.isNaN(parseInt(users[role].max))
        ) {
            defaultUsers[role].max = parseInt(users[role].max);
        }
    }

    // Creation stuff
    const newProject = new ProjectCreation(
        name,
        '',
        res.locals.user?._id,
        isPrivate,
        description,
        fields,
        // skills and roles are validated in the create function in mongo
        defaultUsers,
        required_skills
    );
    const enterProject = await db.projectRepository.Create(newProject);

    res.locals.user.projects.push(enterProject._id);

    await db.userRepository.Update(res.locals.user._id, {
        projects: res.locals.user.projects,
    });

    res.status(200).json({
        error: '',
        success: 'Project created!',
        project: enterProject,
    });
});

export default ProjectRouter;
