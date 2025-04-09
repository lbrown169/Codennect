import { Collection, MongoClient } from "mongodb";
import {
    VerificationCodeRepository,
    VerificationReponse,
} from "../domain/Verification";

export class MongoVerificationRepository implements VerificationCodeRepository {
    private collection: Collection;

    constructor(client: MongoClient) {
        if (process.env.NODE_ENV === "production") {
            this.collection = client
                .db("codennect")
                .collection("verifications");
        } else {
            this.collection = client
                .db("development")
                .collection("verifications");
        }
    }

    async RegisterVerification(email: string, code: string): Promise<boolean> {
        let result = await this.collection.findOne({ email: email });
        if (result !== null) {
            return Promise.resolve(false);
        } else {
            await this.collection.insertOne({
                email: email,
                code: code,
                expires: Date.now() + 15 * 60 * 1000,
            });
            return Promise.resolve(true);
        }
    }

    async DeleteVerification(email: string): Promise<boolean> {
        let result = await this.collection.deleteOne({ email: email });
        if (result.deletedCount > 0) {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    async ValidateVerification(email: string, code: string): Promise<boolean> {
        let result = (await this.collection.findOne({
            email: email,
            code: code,
        })) as VerificationReponse;

        if (result === null) {
            return Promise.resolve(false);
        }
        if (result.expires < Date.now()) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }
}
