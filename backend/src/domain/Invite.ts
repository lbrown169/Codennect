export class Invite {
    project: string;
    roles: string[];
    message: string;

    constructor(project: string, roles: string[], message: string) {
        this.project = project;
        this.roles = roles;
        this.message = message;
    }
}
