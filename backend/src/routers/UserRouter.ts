import { PossibleRoles, PossibleSkills } from '../domain/User.js';
import express, { Request } from 'express';
import { Driver } from '../repo/Driver.js';
import { Response } from '../utils.js';
import checkVerification from '../middleware/checkVerification.js';

const UserRouter = express.Router();
UserRouter.use(checkVerification);

UserRouter.get('/api/users', async (req: Request, res: Response) => {
    // incoming: name, skills, roles
    // outgoing: all the users

    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    // optional parameters
    const { name, skills, roles } = req.query;
    const db: Driver = req.app.locals.driver;

    try {
        // get all users
        let users = await db.userRepository.GetAll();

        // filter by roles if provided
        if (name) {
            users = users.filter((user) =>
                user.name.toLowerCase().includes(name.toString().toLowerCase())
            );
        }

        if (roles) {
            const parsedRoles = roles.toString().split(',');

            // validate roles
            const validRoles = parsedRoles.filter((role) =>
                PossibleRoles.includes(role)
            );

            users = users.filter((user) =>
                user.roles.some((roles) => validRoles.includes(roles))
            );
        }

        // Filter by skill if provided
        if (skills) {
            const parsedSkills = skills.toString().split(',');

            // validate skills
            const validSkills = parsedSkills.filter((skill) =>
                PossibleSkills.includes(skill)
            );

            users = users.filter((user) =>
                user.skills.some((skill) => validSkills.includes(skill))
            );
        }

        res.status(200).json({
            error: '',
            result: users.map((user) => user.toJson()),
        });
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving ysers.' });
    }
});

UserRouter.get('/api/users/me', async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    res.status(200).json({ error: '', result: res.locals.user });
});

UserRouter.get('/api/users/:id', async (req: Request, res: Response) => {
    // incoming: user id
    // outgoing: all the user info

    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const id = req.params.id;
    const db: Driver = req.app.locals.driver;

    if (!id) {
        res.status(400).json({
            error: "Field 'id' must be specified",
        });
        return;
    }

    const theUser = await db.userRepository.GetById(id.toString());

    if (theUser == null) {
        res.status(400).json({ error: 'User not found!' });
        return;
    }

    // if the profile is public, return it
    if (!theUser.isPrivate) {
        res.status(200).json({ error: '', result: theUser.toJson() });
        return;
    }

    // Profile is private — check if the viewer shares a project with them or they applied
    const viewerProjects = res.locals.user.projects;

    // check for shared membership first
    for (let pid of viewerProjects) {
        const project = await db.projectRepository.GetById(pid);
        if (!project) continue;

        const isMember = Object.values(project.users).some((role) =>
            role.users.includes(theUser._id)
        );

        if (isMember) {
            res.status(200).json({ error: '', result: theUser.toJson() });
            return;
        }
    }

    // check if theUser has applied to any of viewer's projects
    const userApplications = await db.requestRepository.GetUserApplications(
        theUser._id
    );
    const hasAppliedToViewerProject = userApplications.some((app) =>
        viewerProjects.includes(app.project_id)
    );

    // check if theUser has been invited to any of viewer's projects
    const userInvites = await db.requestRepository.GetUserInvites(theUser._id);
    const hasBeenInvitedToViewerProject = userInvites.some((app) =>
        viewerProjects.includes(app.project_id)
    );

    if (hasAppliedToViewerProject || hasBeenInvitedToViewerProject) {
        res.status(200).json({ error: '', result: theUser.toJson() });
        return;
    }

    // if no access
    res.status(403).json({
        error: 'This user has a private profile and you do not share any projects with them.',
    });
});

UserRouter.patch('/api/users/me', async (req: Request, res: Response) => {
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
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const { updates } = req.body;
    const db: Driver = req.app.locals.driver;

    if (!updates || typeof updates !== 'object') {
        res.status(400).json({ error: 'Invalid request format' });
        return;
    }

    // uses an update user function in the repo itself
    // function takes in id and the updates and handles it internally
    // skills and roles validated in the function
    const success = await db.userRepository.Update(
        res.locals.user._id,
        updates
    );

    if (!success) {
        res.status(400).json({ error: 'User not found or no changes made' });
        return;
    }

    let theUser;
    try {
        theUser = await db.userRepository.GetById(res.locals.user._id);
    } catch {
        res.status(400).json({ error: 'Invalid ID format!' });
        return;
    }

    res.locals.user = theUser;

    res.status(200).json({ error: '', success: true, updatedUser: theUser });
});

export default UserRouter;
