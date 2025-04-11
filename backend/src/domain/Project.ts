import { Account } from "./Account";
import { Invite } from "./Invite";

export type fieldDetails = {
    name: string;
    value: string;
    private: boolean;
};

export class Project {
    _id: string;
    name: string;
    domain: string;
    owner: string;
    is_private: boolean;
    description: string;
    fields: fieldDetails[];
    roles: { [role: string]: number };
    users: string[];
    required_skills: string[];
    

    constructor(
        _id: string,
        name: string,
        domain: string,
        owner: string,
        is_private: boolean,
        description: string,
        fields: fieldDetails[],
        roles: { [role: string]: number },
        users: string[],
        required_skills: string[]
    ) {
        this._id = _id;
        this.name = name;
        this.domain = domain;
        this.owner = owner;
        this.is_private = is_private;
        this.description = description;
        this.fields = fields;
        this.roles = roles;
        this.users = users;
        this.required_skills = required_skills;
    }
}

// the draft/base for a project
export class ProjectCreation {
    name: string;
    domain?: string;
    owner: string;
    is_private: boolean;
    description: string;
    fields?: fieldDetails[];
    roles?: { [role: string]: number };
    users?: string[];
    required_skills?: string[];

    constructor(
        name: string,
        domain: string = "",
        owner: string,
        is_private: boolean,
        description: string = "",
        fields: fieldDetails[] = [],
        roles: { [role: string]: number } = {},
        users: string[] = [],
        required_skills: string[] = [],
    ) {
        this.name = name;
        this.domain = domain;
        this.owner = owner;
        this.is_private = is_private;
        this.description = description;
        this.fields = fields;
        this.roles = roles;
        this.users = users;
        this.required_skills = required_skills;
    }
}

export interface ProjectRepository {
    GetAll(): Promise<Project[]>;
    GetById(id: string): Promise<Project | undefined>;
    GetByName(name: string): Promise<Project | undefined>;
    Create(project: ProjectCreation): Promise<Project>;
    Update(id: string, updates: Partial<Project>): Promise<boolean>
}
