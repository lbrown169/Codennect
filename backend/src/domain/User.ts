import { Account } from '../domain/Account.js';

export type VerificationInUser = {
    code: string;
    newUser: boolean;
    expires: number;
};

export const PossibleSkills = [
    'Android(Kotlin/Java)',
    'Angular',
    'Arduino',
    'AWS',
    'C#',
    'C++',
    'Dart',
    'Docker',
    'Express.js',
    'Figma(UI/UX)',
    'Firebase',
    'Flutter',
    'Google Cloud',
    'GraphQL',
    'iOS(Swift)',
    'Java',
    'JavaScript',
    'Machine Learning',
    'MongoDB',
    'MySQL',
    'Node.js',
    'OpenAI API',
    'PostgreSQL',
    'Raspberry Pi',
    'React',
    'React Native',
    'REST API',
    'Swift',
    'TensorFlow',
    'TypeScript',
    'Vue.js',
];

export const PossibleRoles = [
    'Project Manager',
    'Frontend',
    'Backend',
    'Database',
    'Mobile',
];

export class User {
    _id: string;
    name: string;
    isPrivate: boolean;
    email: string;
    comm: string;
    skills: string[];
    roles: string[];
    interests: string[];
    accounts: Account[];
    projects: string[];
    // allow it to be null so a registered user can have a null one
    verification: VerificationInUser | null;

    constructor(
        _id: string,
        name: string,
        isPrivate: boolean = false, // default to public to make easier?
        email: string,
        comm: string,
        skills: string[],
        roles: string[],
        interests: string[],
        accounts: Account[],
        projects: string[],
        verification: VerificationInUser | null
    ) {
        this._id = _id;
        this.name = name;
        this.isPrivate = isPrivate;
        this.email = email;
        this.comm = comm;
        this.skills = skills;
        this.roles = roles;
        this.interests = interests;
        this.accounts = accounts;
        this.projects = projects;
        this.verification = verification;
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
    verification: VerificationInUser;

    constructor(
        name: string,
        email: string,
        password: string,
        verification: VerificationInUser
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.verification = verification;
    }
}

export interface UserRepository {
    GetAll(): Promise<User[]>;
    GetById(id: string): Promise<User | undefined>;
    GetByEmail(email: string): Promise<User | undefined>;
    GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined>;
    Register(user: UserRegistration): Promise<User>;
    Update(id: string, updates: Partial<User>): Promise<boolean>;
    UpdatePassword(id: string, newPassword: string): Promise<boolean>;
    ValidateVerification(code: string): Promise<boolean>;
    DeleteVerification(code: string): Promise<boolean>;
}
