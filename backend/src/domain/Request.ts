export class Request {
    project_id: string;
    user_id: string;
    roles: string[];
    message: string;
    is_invite: boolean;
    is_application: boolean;

    constructor(
        project: string,
        user_id: string,
        roles: string[],
        message: string,
        type: string
    ) {
        this.project_id = project;
        this.user_id = user_id;
        this.roles = roles;
        this.message = message;

        if (type === "invite") {
            this.is_invite = true;
        } else if (type === "application") {
            this.is_invite = false;
        } else {
            throw new Error("Request type not recognized");
        }
        this.is_application = !this.is_invite;
    }
}

export interface RequestRepository {
    GetUserInvites(user_id: string): Promise<Request[]>;
    GetUserApplications(user_id: string): Promise<Request[]>;
    GetProjectInvites(project_id: string): Promise<Request[]>;
    GetProjectApplications(project_id: string): Promise<Request[]>;

    CreateRequest(req: Request): Promise<boolean>;
    DeleteRequest(req: Request): Promise<boolean>;
}
