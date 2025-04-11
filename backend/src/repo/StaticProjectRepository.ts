import { randomInt } from "crypto";
import { Account } from "../domain/Account";
import { Invite } from "../domain/Invite";
import { Project, ProjectCreation, ProjectRepository } from "../domain/Project";

class StaticProject extends Project {
    constructor(
        _id: string,
        name: string,
        is_public : boolean,

        // require access
        creator_id: string,
        description: string,
        required_skills: string[],
        member_ids: string[],
        applications: string[],
        github_link: string[],
        discord_link: string[]
    ) {
        super(
            _id,
            name,
            is_public,
            creator_id,
            description,
            required_skills,
            member_ids,
            applications,
            github_link,
            discord_link,
        );
    }
}

export class StaticProjectRepository implements ProjectRepository {
    private _internal: StaticProject[];

    constructor() {
        this._internal = [
            new StaticProject(
                "0",
                "Project McProjectFace",
                false,
                "",
                "The coolest project ever.",
                [],
                [],
                [],
                [],
                []
            ),
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
        return Promise.resolve(this._internal.find((project) => project._id === id));
    }

    async GetByName(name: string): Promise<Project | undefined> {
        return Promise.resolve(this._internal.find((project) => project.name === name));
    }

    async GetAll(): Promise<Project[]> {
        return Promise.resolve(this._internal);
    }

    async Create(project: ProjectCreation): Promise<Project> {
        const newProject = new StaticProject(
            randomInt(1000000).toString(),
            project.name,
            project.is_public,
            project.creator_id,
            "",
            [],
            [],
            [],
            [],
            []
        );

        this._internal.push(newProject);

        return Promise.resolve(newProject);
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
