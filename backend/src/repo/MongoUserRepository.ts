import { User, UserRegistration, UserRepository } from "../domain/User";
import { Collection, MongoClient, ObjectId } from "mongodb";

export class MongoUserRepository implements UserRepository {
    private collection: Collection;

    constructor(client: MongoClient) {
        if (process.env.NODE_ENV === "production") {
            this.collection = client.db("codennect").collection("users");
        } else {
            this.collection = client.db("development").collection("users");
        }
    }

    async GetAll(): Promise<User[]> {
        const results = await this.collection.find().toArray();

        return results.map((result) => 
            new User(
                result._id.toString(),
                result.name,
                result.isPrivate,
                result.email,
                result.comm,
                result.skills,
                result.roles,
                result.interests,
                result.accounts,
                result.projects,
                result.invites
            )
        );
    }

    async GetById(id: string): Promise<User | undefined> {
        let result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve(
            new User(
                result._id.toString(),
                result.name,
                result.isPrivate,
                result.email,
                result.comm,
                result.skills,
                result.roles,
                result.interests,
                result.accounts,
                result.projects,
                result.invites
            )
        );
    }

    async GetByEmail(email: string): Promise<User | undefined> {
        let result = await this.collection.findOne({ email: email });
        if (!result) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve(
            new User(
                result._id.toString(),
                result.name,
                result.isPrivate,
                result.email,
                result.comm,
                result.skills,
                result.roles,
                result.interests,
                result.accounts,
                result.projects,
                result.invites
            )
        );
    }

    async GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined> {
        let result = await this.collection.findOne({
            email: email,
            password: password,
        });
        if (!result) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve(
            new User(
                result._id.toString(),
                result.name,
                result.isPrivate,
                result.email,
                result.comm,
                result.skills,
                result.roles,
                result.interests,
                result.accounts,
                result.projects,
                result.invites
            )
        );
    }

    async Register(user: UserRegistration): Promise<User> {
        if ((await this.GetByEmail(user.email)) !== undefined) {
            throw new Error("A user with that email already exists");
        }

        const result = await this.collection.insertOne({
            name: user.name,
            email: user.email,
            password: user.password,
            accounts: {},
            comm: "",
            skills: [],
            roles: [],
            interests: [],
            projects: [],
            invites: [],
        });

        let returning = await this.GetById(result.insertedId.toString());

        if (!returning) {
            throw new Error("Failed to create user");
        }

        return Promise.resolve(returning);
    }
}
