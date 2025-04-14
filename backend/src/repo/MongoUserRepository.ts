import { User, UserRegistration, UserRepository } from "../domain/User.js";
import { HashPassword } from "../service/auth.js";

import { Collection, MongoClient, ObjectId } from "mongodb";
import { isProd } from "../utils.js";
import bcrypt from "bcrypt";

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
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects
        );
    }

    async GetByEmail(email: string): Promise<User | undefined> {
        let result = await this.collection.findOne({ email: email });
        if (!result) {
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects
        );
    }

    async GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined> {
        let result = await this.collection.findOne({ email: email });

        // if couldn't find by email
        if (!result) {
            return undefined;
        }

        // compare hashed password
        const isMatch = await bcrypt.compare(password, result.password);

        // if couldn't find by password
        if (!isMatch) {
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects
        );
    }

    async Register(user: UserRegistration): Promise<User> {
        if ((await this.GetByEmail(user.email)) !== undefined) {
            throw new Error("A user with that email already exists");
        }

        const result = await this.collection.insertOne({
            name: user.name,
            email: user.email,
            password: await HashPassword(user.password),
            accounts: {},
            comm: "",
            skills: [],
            roles: [],
            interests: [],
            projects: [],
        });

        let returning = await this.GetById(result.insertedId.toString());

        if (!returning) {
            throw new Error("Failed to create user");
        }

        return returning;
    }

    async Update(id: string, updates: Partial<User>): Promise<boolean> {
        const objectId = new ObjectId(id);

        const result = await this.collection.updateOne(
            { _id: objectId }, // find by id
            { $set: updates } // do all the updates
        );

        // true if updated
        return result.modifiedCount > 0;
    }
}
