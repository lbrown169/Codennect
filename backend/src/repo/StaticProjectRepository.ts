import {
    Project,
    ProjectCreation,
    ProjectRepository,
} from "../domain/Project.js";

export class StaticProjectRepository implements ProjectRepository {
    private _internal: Project[];

    constructor() {
        this._internal = [
            // new StaticProject(
            //     "0",
            //     "Project McProjectFace",
            //     false,
            //     "",
            //     "The coolest project ever.",
            //     [],
            //     [],
            //     [],
            //     [],
            //     []
            // ),
            // new StaticUser(
            //     "1",
            //     "Jane Doe",
            //     "jane.doe@example.com",
            //     "In Person",
            //     ["Python", "Flask", "SQL"],
            //     ["backend", "database"],
            //     ["games"],
            //     [],
            //     [],
            //     [],
            //     "VeryS3cureP4ssw0!d"
            // ),
        ];
    }

    async GetById(id: string): Promise<Project | undefined> {
        return this._internal.find((project) => project._id === id);
    }

    async GetByPartialName(name: string): Promise<Project[]> {
        return this._internal.filter(
            (project) => project.name.includes(name) && !project.is_private
        );
    }

    async GetAll(): Promise<Project[]> {
        return this._internal.filter((project) => !project.is_private);
    }

    async Create(project: ProjectCreation): Promise<Project> {
        const newProject = new Project(
            crypto.randomUUID(),
            project.name,
            "",
            project.owner,
            project.is_private,
            "",
            [],
            {},
            [],
            []
        );

        this._internal.push(newProject);

        return newProject;
    }

    async Update(id: string, updates: Partial<Project>): Promise<boolean> {
        // find project, return false if not found
        const project = this._internal.find((project) => project._id === id);

        if (!project) return false;

        // update the found user
        Object.assign(project, updates);

        return true;
    }
}
