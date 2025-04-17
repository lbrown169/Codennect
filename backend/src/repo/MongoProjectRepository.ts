import {
    Project,
    ProjectCreation,
    ProjectRepository,
} from "../domain/Project.js";
import { Collection, Db, ObjectId } from "mongodb";
export class MongoProjectRepository implements ProjectRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection("projects");
    }

    async GetAll(): Promise<Project[]> {
        const results = await this.collection
            .find({ isPrivate: false })
            .toArray();

        return results.map(
            (result) =>
                new Project(
                    result._id.toString(),
                    result.name,
                    result.domain,
                    result.owner,
                    result.isPrivate,
                    result.description,
                    result.fields,
                    result.roles,
                    result.users,
                    result.required_skills
                )
        );
    }

    async GetById(id: string): Promise<Project | undefined> {
        let result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return undefined;
        }

        return new Project(
            result._id.toString(),
            result.name,
            result.domain,
            result.owner,
            result.isPrivate,
            result.description,
            result.fields,
            result.roles,
            result.users,
            result.required_skills
        );
    }

    async GetByPartialName(name: string): Promise<Project[]> {
        let results = await this.collection
            .find({ name: { $regex: name }, isPrivate: false })
            .toArray();

        return results.map(
            (result) =>
                new Project(
                    result._id.toString(),
                    result.name,
                    result.domain,
                    result.owner,
                    result.isPrivate,
                    result.description,
                    result.fields,
                    result.roles,
                    result.users,
                    result.required_skills
                )
        );
    }

    async Create(project: ProjectCreation): Promise<Project> {
        const result = await this.collection.insertOne({
            name: project.name,
            domain: project.domain,
            owner: project.owner,
            isPrivate: project.isPrivate,
            description: project.description ?? "",
            fields: project.fields ?? [],
            roles: project.roles ?? [],
            users: project.users ?? [],
            required_skills: project.required_skills ?? [],
        });

        let returning = await this.GetById(result.insertedId.toString());

        if (!returning) {
            throw new Error("Failed to create project");
        }

        return returning;
    }

    async Update(id: string, updates: Partial<Project>): Promise<boolean> {
        const objectId = new ObjectId(id);

        const result = await this.collection.updateOne(
            { _id: objectId }, // find by id
            { $set: updates } // do all the updates
        );

        // true if updated
        return result.modifiedCount > 0;
    }
}
