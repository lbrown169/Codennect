import { Request as ProjectRequest, RequestType } from '../domain/Request.js';
import express, { Request } from 'express';
import { Driver } from '../repo/Driver.js';
import { Response } from '../utils.js';
import { IMailgunClient } from 'node_modules/mailgun.js/Types/Interfaces/index.js';
import checkVerification from '../middleware/checkVerification.js';

const RequestRouter = express.Router();
RequestRouter.use(checkVerification);

interface RequestsResponse {
    invites: {
        me: ProjectRequest[];
        [project_id: string]: ProjectRequest[];
    };
    applications: {
        me: ProjectRequest[];
        [project_id: string]: ProjectRequest[];
    };
}

RequestRouter.get('/api/requests', async (req: Request, res: Response) => {
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const db: Driver = req.app.locals.driver;

    let response: RequestsResponse = {
        invites: { me: [] },
        applications: { me: [] },
    };

    response.invites.me = await db.requestRepository.GetUserInvites(
        res.locals.user._id
    );

    response.applications.me = await db.requestRepository.GetUserApplications(
        res.locals.user._id
    );

    for (let pid of res.locals.user.projects) {
        const project = await db.projectRepository.GetById(pid);
        if (!project) continue;
        if (project.owner === res.locals.user._id) {
            response.invites[project._id] =
                await db.requestRepository.GetProjectInvites(project._id);
            response.applications[project._id] =
                await db.requestRepository.GetProjectApplications(project._id);
        }
    }

    res.status(200).json({ error: '', result: response });
});

RequestRouter.post('/api/requests', async (req: Request, res: Response) => {
    // Creates new application to join a project
    // Passed: user_id, projectId, message (all strings)
    if (!res.locals.user) {
        res.status(401).json({
            error: 'Unauthorized. You must be logged in to perform this action.',
        });
        return;
    }

    const { user_id, project_id, is_invite, roles, message } = req.body;
    const db: Driver = req.app.locals.driver;
    const project = await db.projectRepository.GetById(project_id);

    if (!project) {
        res.status(400).json({
            error: 'Bad request. Provided project does not exist.',
        });
        return;
    }

    if (is_invite) {
        // Is an invite, we need to make sure authenticated user is the owner
        if (project.owner !== res.locals.user._id) {
            res.status(403).json({
                error: 'Forbidden. Only project owners can create invites.',
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
            error: 'Bad request. user_id, project_id, is_invite, and roles are required.',
        });
        return;
    }

    if (!Array.isArray(roles) || roles.length == 0) {
        res.status(400).json({
            error: 'Bad request. Roles must be an array greater than size 0.',
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

    // Send email
    const user = await db.userRepository.GetById(user_id);
    if (!user) {
        res.status(400).json({
            error: 'Bad request. Provided user not found.',
        });
        return;
    }
    if (req.app.locals.transporter) {
        let t: IMailgunClient = req.app.locals.transporter;
        let message;
        let recipient;

        if (is_invite) {
            message = `
            Hey there ${user.name},<br /><br />
            You have been sent an invite to join the ${project.name} project! Be sure to check it out!`;
            recipient = user.email;
        } else {
            // application
            message = `
            Hey there ${user.name},<br /><br />
            You have received a new application from a user wishing to join the ${project.name} project!`;
            recipient = (await db.userRepository.GetById(project.owner))?.email;
        }
        if (recipient) {
            const info = await t.messages.create(process.env.MAILGUN_DOMAIN!, {
                from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [recipient],
                subject: `${project.name} Request Update`,
                html: message,
            });
            console.log('Approval email sent.', info);
        }
    }

    res.status(200).json({
        error: '',
        success: 'Request sent!',
        request: newRequest,
    });
});

RequestRouter.post(
    '/api/requests/approve',
    async (req: Request, res: Response) => {
        if (!res.locals.user) {
            res.status(401).json({
                error: 'Unauthorized. You must be logged in to perform this action.',
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
                error: 'Bad request. Request not found.',
            });
            return;
        }

        const user = await db.userRepository.GetById(user_id);
        const project = await db.projectRepository.GetById(project_id);

        if (!user) {
            res.status(400).json({
                error: 'Bad request. Provided user not found.',
            });
            return;
        }

        if (!project) {
            res.status(400).json({
                error: 'Bad request. Provided project not found.',
            });
            return;
        }

        if (is_invite) {
            // It's an invite, it must be the user who is accepting the invite
            if (res.locals.user._id !== user_id) {
                res.status(403).json({
                    error: 'Forbidden. Only the user receiving the invite can approve it.',
                });
                return;
            }
        } else {
            // Application, only the project owner can accept it
            if (res.locals.user._id !== project.owner) {
                res.status(403).json({
                    error: 'Forbidden. Only the project owner can approve an application.',
                });
                return;
            }
        }

        // Remove them from any roles they are currently in
        // in case they're trying to change roles
        for (let role of Object.keys(project.users)) {
            const roleData = project.users[role];
            if (roleData) {
                roleData.users = roleData.users.filter(
                    (user) => user !== user_id
                );
            }
        }

        await db.projectRepository.Update(project_id, {
            users: project.users,
        });
        // if (!saveToProject) {
        //     res.status(500).json({
        //         error: 'Could not overwrite roles.',
        //     });
        //     return;
        // }

        // // Place them into their assigned roles
        // for (let role of request.roles) {
        //     // make sure the role exists in the project and add it if it doesn't
        //         // (could validate against PossibleRoles here too)
        //     if (!project.users[role]) {
        //         project.users[role] = {
        //             max: 1, // default max value
        //             users: []
        //         };
        //     }

        //     // add the user to the role
        //     project.users[role].users.push(user_id);
        // }

        // add to project repo with dedicated function
        await db.projectRepository.AddUserToProject(
            project_id,
            user_id,
            request.roles
        );

        // Now insert project id into user
        if (user.projects.indexOf(project_id) === -1) {
            user.projects.push(project_id);
            await db.userRepository.Update(user_id, {
                projects: user.projects,
            });
        }

        await db.requestRepository.DeleteRequest(request);

        if (req.app.locals.transporter) {
            let t: IMailgunClient = req.app.locals.transporter;
            let message = `
            Hey there ${user.name},<br /><br />
            Congratulations! You are now on the team for the ${project.name} project!
        `;
            const info = await t.messages.create(process.env.MAILGUN_DOMAIN!, {
                from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [user.email],
                subject: `${project.name} Request Update`,
                html: message,
            });
            console.log('Approval email sent.', info);
        }
        res.status(200).json({ error: '', result: 'Request approved.' });
    }
);

RequestRouter.post(
    '/api/requests/deny',
    async (req: Request, res: Response) => {
        if (!res.locals.user) {
            res.status(401).json({
                error: 'Unauthorized. You must be logged in to perform this action.',
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
                error: 'Bad request. Request not found.',
            });
            return;
        }

        const user = await db.userRepository.GetById(user_id);
        const project = await db.projectRepository.GetById(project_id);

        if (!user) {
            res.status(400).json({
                error: 'Bad request. Provided user not found.',
            });
            return;
        }

        if (!project) {
            res.status(400).json({
                error: 'Bad request. Provided project not found.',
            });
            return;
        }

        if (![user_id, project.owner].includes(res.locals.user._id)) {
            res.status(403).json({
                error: 'Forbidden. Only the user or project owner can deny a request.',
            });
            return;
        }

        await db.requestRepository.DeleteRequest(request);

        if (req.app.locals.transporter) {
            let t: IMailgunClient = req.app.locals.transporter;
            let message = `
                Hey there ${user.name},<br /><br />
                We regret to inform you that your request to join ${project.name} has been denied.
                If you have any questions, please direct them to the project owner.
            `;
            const info = await t.messages.create(process.env.MAILGUN_DOMAIN!, {
                from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [user.email],
                subject: `${project.name} Request Update`,
                html: message,
            });
            console.log('Denial email sent.', info);
        }
        res.status(200).json({ error: '', result: 'Request denied.' });
    }
);

export default RequestRouter;
