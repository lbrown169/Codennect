import { Account } from "../domain/Account.js";
import { Invite } from "../domain/Invite.js";

export class User {
    _id: string;
    name: string;
    email: string;
    comm: string;
    skills: string[];
    roles: string[];
    interests: string[];
    accounts: Account[];
    projects: string[];

    constructor(
        _id: string,
        name: string,
        email: string,
        comm: string,
        skills: string[],
        roles: string[],
        interests: string[],
        accounts: Account[],
        projects: string[]
    ) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.comm = comm;
        this.skills = skills;
        this.roles = roles;
        this.interests = interests;
        this.accounts = accounts;
        this.projects = projects;
    }

    toJson(): Object {
        const { email, projects, ...trimmed } = this;
        return trimmed;
    }
}

export class UserRegistration {
    name: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export interface UserRepository {
    GetById(id: string): Promise<User | undefined>;
    GetByEmail(email: string): Promise<User | undefined>;
    GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined>;
    Register(user: UserRegistration): Promise<User>;
    Update(id: string, updates: Partial<User>): Promise<boolean>;
}
