import { MongoClient } from "mongodb";
import { UserRepository } from "../domain/User.js";
import { MongoUserRepository } from "./MongoUserRepository.js";
import { StaticUserRepository } from "./StaticUserRepository.js";
import { VerificationCodeRepository } from "src/domain/Verification.js";
import { StaticVerificationRepository } from "./StaticVerificationRepository.js";
import { MongoVerificationRepository } from "./MongoVerificationRepository.js";
import { isProd } from "../utils.js";

export interface Driver {
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;
    destroy(): Promise<void>;
}

class StaticDriver implements Driver {
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;

    constructor() {
        this.userRepository = new StaticUserRepository();
        this.verificationRepository = new StaticVerificationRepository();
    }

    async destroy() {}
}

class MongoDriver implements Driver {
    private client: MongoClient;
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;

    constructor() {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "Loading Mongo Driver but did not find MONGODB_URI in environment"
            );
        }
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.client.connect();
        this.userRepository = new MongoUserRepository(this.client);
        this.verificationRepository = new MongoVerificationRepository(
            this.client
        );
    }

    async destroy() {
        await this.client.close();
    }
}

export function loadDatabaseDriver(): Driver {
    if (!isProd() && process.env.EXPLICIT_USE_MONGO != "true") {
        return new StaticDriver();
    } else {
        return new MongoDriver();
    }
}
