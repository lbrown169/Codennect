import { MongoClient } from "mongodb";
import { UserRepository } from "../domain/User";
import { ProjectRepository } from "../domain/Project";
import { MongoUserRepository } from "./MongoUserRepository";
import { StaticUserRepository } from "./StaticUserRepository";
import { MongoProjectRepository } from "./MongoProjectRepository";
import { StaticProjectRepository } from "./StaticProjectRepository";

export interface Driver {
    userRepository: UserRepository;
    projectRepository: ProjectRepository;
    destroy(): Promise<void>;
}

class StaticDriver implements Driver {
    userRepository: UserRepository;
    projectRepository: ProjectRepository;

    constructor() {
        this.userRepository = new StaticUserRepository();
        this.projectRepository = new StaticProjectRepository();
    }

    async destroy() {}
}

class MongoDriver implements Driver {
    private client: MongoClient;
    userRepository: UserRepository;
    projectRepository: ProjectRepository;

    constructor() {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "Loading Mongo Driver but did not find MONGODB_URI in environment"
            );
        }
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.client.connect();
        this.userRepository = new MongoUserRepository(this.client);
        this.projectRepository = new MongoProjectRepository(this.client);
    }

    async destroy() {
        await this.client.close();
    }
}

export function loadDatabaseDriver(): Driver {
    if (
        process.env.NODE_ENV != "production" &&
        process.env.EXPLICIT_USE_MONGO != "true"
    ) {
        return new StaticDriver();
    } else {
        return new MongoDriver();
    }
}
