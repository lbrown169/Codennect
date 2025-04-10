import { stat } from "fs";
import { Account } from "./Account";
import { Invite } from "./Invite";

export class ProjectApplication {
    _id: string;
    applicant_id: string;
    project_id: string;
    message: string; // not sure how to make optional
    status: string; // should be from an enum

    constructor(
        _id: string,
        applicant_id: string,
        project_id: string,
        message: string, // not sure how to make optional
        status: string // should be from an enum

    ) {
        this._id = _id;
        this.applicant_id = applicant_id;
        this.project_id = project_id;
        this.message = message;
        this.status = status;
    }
}

// // not sure whether to keep this and rework or just delete
//     // will probably rework, good to have a less strict constructor than the full one
// export class UserRegistration {
//     name: string;
//     email: string;
//     password: string;

//     constructor(name: string, email: string, password: string) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }
// }

// very much needs to be made still!
export interface ProjectApplicationRepository {
    GetById(id: string): Promise<ProjectApplication | undefined>;
    GetByApplicantID(applicant_id: string): Promise<ProjectApplication | undefined>;
    GetByProjectID(project_id: string): Promise<ProjectApplication | undefined>;
    // Register(user: UserRegistration): Promise<Project>;
}
