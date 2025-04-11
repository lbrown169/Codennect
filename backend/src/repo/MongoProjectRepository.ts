import { Project, ProjectRepository } from "../domain/Project";
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

    async GetAll(): Promise<Project[] | undefined> {
        const results = await this.collection.find().toArray();

        return results.map((result) => 
            new Project(
                result._id.toString(),
                result.name,
                result.is_public,
                result.creator_id,
                result.description,
                result.required_skills,
                result.member_ids,
                result.applications,
                result.github_link,
                result.discord_link
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
                result.is_public,
                result.creator_id,
                result.description,
                result.required_skills,
                result.member_ids,
                result.applications,
                result.github_link,
                result.discord_link
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
                result.is_public,
                result.creator_id,
                result.description,
                result.required_skills,
                result.member_ids,
                result.applications,
                result.github_link,
                result.discord_link
            )
        );
    }

    async Create(project: ProjectCreation): Promise<Project> {
        const result = await this.collection.insertOne({
            
        })
    }

    // async Register(user: UserRegistration): Promise<User> {
    //     if ((await this.GetByEmail(user.email)) !== undefined) {
    //         throw new Error("A user with that email already exists");
    //     }

    //     const result = await this.collection.insertOne({
    //         name: user.name,
    //         email: user.email,
    //         password: user.password,
    //         accounts: {},
    //         comm: "",
    //         skills: [],
    //         roles: [],
    //         interests: [],
    //         projects: [],
    //         invites: [],
    //     });

    //     let returning = await this.GetById(result.insertedId.toString());

    //     if (!returning) {
    //         throw new Error("Failed to create user");
    //     }

    //     return Promise.resolve(returning);
    // }
}
