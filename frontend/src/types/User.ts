import { Account } from './Account';
import { Project } from './Project';

export type User = {
    _id: string;
    name: string;
    isPrivate: boolean;
    comm: string;
    skills: string[];
    roles: string[];
    interests: string[];
    accounts: Account[];
};

export type LoggedInUser = User & {
    email: string;
    projects: Project[];
};
