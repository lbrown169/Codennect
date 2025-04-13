import { User, UserRegistration, UserRepository } from "src/domain/User.js";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { isProd } from "src/utils.js";

export class MongoUserRepository implements UserRepository {
    private collection: Collection;

    constructor(client: MongoClient) {
        if (isProd()) {
            this.collection = client.db("codennect").collection("users");
        } else {
            this.collection = client.db("development").collection("users");
        }
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
