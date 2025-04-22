// Oh boy
/*
import { Collection, Db, MongoClient } from "mongodb";
import {
    VerificationCodeRepository,
    VerificationReponse,
} from "../domain/Verification.js";
import { isProd } from "../utils.js";

export class MongoVerificationRepository implements VerificationCodeRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection("verifications");
    }

    async RegisterVerification(email: string, code: string): Promise<boolean> {
        let result = await this.collection.findOne({ email: email });
        if (result !== null) {
            return false;
        } else {
            await this.collection.insertOne({
                email: email,
                code: code,
                expires: Date.now() + 15 * 60 * 1000,
            });
            return true;
        }
    }

    async DeleteVerification(email: string): Promise<boolean> {
        let result = await this.collection.deleteOne({ email: email });
        if (result.deletedCount > 0) {
            return true;
        }
        return false;
    }

    async ValidateVerification(email: string, code: string): Promise<boolean> {
        let result = (await this.collection.findOne({
            email: email,
            code: code,
        })) as VerificationReponse;

        if (result === null) {
            return false;
        }
        if (result.expires < Date.now()) {
            return false;
        }
        return true;
    }
}
*/
