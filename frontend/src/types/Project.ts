export type FieldDetails = {
    name: string;
    value: string;
    private: boolean;
};

export type ProjectUsers = {
    [role: string]: {
        max: number;
        users: string[];
    };
};

export type Project = {
    _id: string;
    name: string;
    domain: string;
    owner: string;
    isPrivate: boolean;
    description: string;
    fields: FieldDetails[];
    users: ProjectUsers;
    required_skills: string[];
};
