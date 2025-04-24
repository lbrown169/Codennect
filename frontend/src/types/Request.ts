export type Request = {
    project_id: string;
    user_id: string;
    roles: string[];
    message: string[];
    is_invite: boolean;
    is_application: boolean;
};

export type RequestsResponse = {
    invites: {
        me: Request[];
        [project_id: string]: Request[];
    };
    applications: {
        me: Request[];
        [project_id: string]: Request[];
    };
};
