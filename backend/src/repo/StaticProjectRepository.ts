import {
    Project,
    ProjectCreation,
    ProjectRepository,
} from '../domain/Project.js'
import { PossibleSkills } from "../domain/User.js";

export class StaticProjectRepository implements ProjectRepository {
    private _internal: Project[]

    constructor() {
        this._internal = [
            new Project(
                '1234-5678',
                'Testing Project',
                '',
                '0',
                true,
                'A testing project for a testing world',
                [],
                {
                    manager: 1,
                    frontend: 2,
                },
                {
                    manager: ['0'],
                    frontend: [],
                },
                []
            ),
            new Project(
                '8765-4321',
                'Another Testing Project',
                '',
                '1',
                false,
                'Another Teating Project',
                [],
                {
                    manager: 1,
                    frontend: 1,
                    backend: 1,
                },
                {
                    manager: ['1'],
                    frontend: ['0'],
                    backend: [],
                },
                []
            ),
        ]
    }

    async GetById(id: string): Promise<Project | undefined> {
        return this._internal.find((project) => project._id === id)
    }

    async GetByPartialName(name: string): Promise<Project[]> {
        return this._internal.filter(
            (project) => project.name.includes(name) && !project.isPrivate
        )
    }

    async GetAll(): Promise<Project[]> {
        return this._internal.filter((project) => !project.isPrivate)
    }

    async Create(project: ProjectCreation): Promise<Project> {
        const newProject = new Project(
            crypto.randomUUID(),
            project.name,
            '',
            project.owner,
            project.isPrivate,
            '',
            [],
            {},
            {},
            []
        )

        this._internal.push(newProject)

        return newProject
    }

    async Update(id: string, updates: Partial<Project>): Promise<boolean> {
        // find project, return false if not found
        const project = this._internal.find((project) => project._id === id)

        if (!project) return false

        if (updates.required_skills) {
            const allValid = updates.required_skills.every(skill =>
                PossibleSkills.includes(skill)
            );
    
            if (!allValid) {
                console.warn("Update failed: invalid skills in input.");
                return false;
            }
        }

        // update the found user
        Object.assign(project, updates)

        return true
    }
}
