import { Db, MongoClient } from "mongodb";
import { UserRepository } from "../domain/User.js";
import { MongoUserRepository } from "./MongoUserRepository.js";
import { StaticUserRepository } from "./StaticUserRepository.js";
import { VerificationCodeRepository } from "src/domain/Verification.js";
import { StaticVerificationRepository } from "./StaticVerificationRepository.js";
import { MongoVerificationRepository } from "./MongoVerificationRepository.js";
import { isProd } from "../utils.js";
import { RequestRepository } from "src/domain/Request.js";
import { StaticRequestRepository } from "./StaticRequestRepository.js";
import { MongoRequestRepository } from "./MongoRequestRepository.js";

export interface Driver {
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;
    requestRepository: RequestRepository;
    destroy(): Promise<void>;
}

class StaticDriver implements Driver {
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;
    requestRepository: RequestRepository;

    constructor() {
        this.userRepository = new StaticUserRepository();
        this.verificationRepository = new StaticVerificationRepository();
        this.requestRepository = new StaticRequestRepository();
    }

    async destroy() {}
}

class MongoDriver implements Driver {
    private client: MongoClient;
    userRepository: UserRepository;
    verificationRepository: VerificationCodeRepository;
    requestRepository: RequestRepository;

    constructor() {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "Loading Mongo Driver but did not find MONGODB_URI in environment"
            );
        }
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.client.connect();

        let db: Db;
        if (isProd()) {
            db = this.client.db("codennect");
        } else {
            db = this.client.db("development");
        }

        this.userRepository = new MongoUserRepository(db);
        this.verificationRepository = new MongoVerificationRepository(db);
        this.requestRepository = new MongoRequestRepository(db);
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
