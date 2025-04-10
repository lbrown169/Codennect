import { Account } from "./Account";
import { Invite } from "./Invite";

export class Project {
    _id: string;
    name: string;
    is_public: boolean;

    // require access
    creator_id: string;
    description: string;
    required_skills: string[];
    member_ids: string[];
    applications: string[];
    github_link: string[];
    discord_link: string[];

    constructor(
        _id: string,
        name: string,
        is_public : boolean,

        // require access
        creator_id: string,
        description: string,
        required_skills: string[],
        member_ids: string[],
        applications: string[],
        github_link: string[],
        discord_link: string[]
    ) {
        this._id = _id;
        this.name = name;
        this.is_public = is_public;
        this.creator_id = creator_id;
        this.description = description;
        this.required_skills = required_skills;
        this.member_ids = member_ids;
        this.applications = applications;
        this.github_link = github_link;
        this.discord_link = discord_link;
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
export interface ProjectRepository {
    GetById(id: string): Promise<Project | undefined>;
    GetByName(name: string): Promise<Project | undefined>;
    // Register(user: UserRegistration): Promise<Project>;
}
