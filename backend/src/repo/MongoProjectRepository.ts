import { Project, ProjectCreation, ProjectRepository } from "../domain/Project";
import { Collection, MongoClient, ObjectId } from "mongodb";

export class MongoProjectRepository implements ProjectRepository {
    private collection: Collection;

    constructor(client: MongoClient) {
        if (process.env.NODE_ENV === "production") {
            this.collection = client.db("codennect").collection("users");
        } else {
            this.collection = client.db("development").collection("users");
        }
    }

    async GetAll(): Promise<Project[]> {
        const results = await this.collection.find().toArray();

        return results.map((result) => 
            new Project(
                result._id.toString(),
                result.name,
                result.domain,
                result.owner,
                result.is_private,
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
            return Promise.resolve(undefined);
        }

        return Promise.resolve(
            new Project(
                result._id.toString(),
                result.name,
                result.domain,
                result.owner,
                result.is_private,
                result.description,
                result.fields,
                result.roles,
                result.users,
                result.required_skills
            )
        )
    }
       

    async GetByName(name: string): Promise<Project | undefined> {
        let result = await this.collection.findOne({ name: name });
        if (!result) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve(
            new Project(
                result._id.toString(),
                result.name,
                result.domain,
                result.owner,
                result.is_private,
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
            is_private: project.is_private,
            description: project.description ?? "",
            fields: [],
            roles: [],
            users: project.users ?? [],
            required_skills: project.required_skills ?? []
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