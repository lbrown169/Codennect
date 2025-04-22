export enum RequestType {
    INVITE = 'invite',
    APPLICATION = 'application',
}

export class Request {
    project_id: string
    user_id: string
    roles: string[]
    message: string
    is_invite: boolean
    is_application: boolean

    constructor(
        project_id: string,
        user_id: string,
        type: string,
        roles: string[],
        message: string
    ) {
        this.project_id = project_id
        this.user_id = user_id

        if (type === RequestType.INVITE) {
            this.is_invite = true
        } else if (type === RequestType.APPLICATION) {
            this.is_invite = false
        } else {
            throw new Error('Request type not recognized');
        }
        this.is_application = !this.is_invite

        this.roles = roles
        this.message = message
    }
}

export interface RequestRepository {
    GetUserInvites(user_id: string): Promise<Request[]>
    GetUserApplications(user_id: string): Promise<Request[]>
    GetProjectInvites(project_id: string): Promise<Request[]>
    GetProjectApplications(project_id: string): Promise<Request[]>

    GetRequest(
        user_id: string,
        project_id: string,
        is_invite: boolean
    ): Promise<Request | null>
    CreateRequest(req: Request): Promise<boolean>
    DeleteRequest(req: Request): Promise<boolean>
}
