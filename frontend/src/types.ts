type FieldDetails = {
    name: string;
    value: string;
    private: boolean;
};

export interface Project {
    _id: string;
    name: string;
    domain: string;
    owner: string;
    is_private: boolean;
    description: string;
    fields: FieldDetails[];
    roles: { [role: string]: number };
    users: { [role: string]: string[] };
    required_skills: string[];
}

export interface User {
    user_id: string;
    name: string;
}

export interface ProjectUsers {
    [role: string]: User[];
}
