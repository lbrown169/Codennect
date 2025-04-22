import { PossibleRoles } from '../domain/User.js'

export type FieldDetails = {
    name: string
    value: string
    private: boolean
}

export type ProjectUsers = {
    [role: string]: {
        max: number
        users: string[]
    }
}

export class Project {
    _id: string
    name: string
    domain: string
    owner: string
    isPrivate: boolean
    description: string
    fields: FieldDetails[]
    users: ProjectUsers
    required_skills: string[]

    constructor(
        _id: string,
        name: string,
        domain: string,
        owner: string,
        isPrivate: boolean,
        description: string,
        fields: FieldDetails[],
        users: ProjectUsers,
        required_skills: string[]
    ) {
        this._id = _id
        this.name = name
        this.domain = domain
        this.owner = owner
        this.isPrivate = isPrivate
        this.description = description
        this.fields = fields
        this.users = users
        this.required_skills = required_skills
    }
}

// the draft/base for a project
export class ProjectCreation {
    name: string
    domain?: string
    owner: string
    isPrivate: boolean
    description: string
    fields?: FieldDetails[]
    users?: ProjectUsers
    required_skills?: string[]

    constructor(
        name: string,
        domain: string = '',
        owner: string,
        isPrivate: boolean,
        description: string = '',
        fields: FieldDetails[] = [],
        users: ProjectUsers = {},
        required_skills: string[] = []
    ) {
        this.name = name
        this.domain = domain
        this.owner = owner
        this.isPrivate = isPrivate
        this.description = description
        this.fields = fields
        this.users = users
        this.required_skills = required_skills
    }
}

export interface ProjectRepository {
    GetById(id: string): Promise<Project | undefined>
    GetByPartialName(name: string): Promise<Project[]>
    GetAll(): Promise<Project[]>
    Create(project: ProjectCreation): Promise<Project>
    Update(id: string, updates: Partial<Project>): Promise<boolean>
    AddUserToProject(
        project_id: string,
        user_id: string,
        roles: string[]
    ): Promise<boolean>
}
