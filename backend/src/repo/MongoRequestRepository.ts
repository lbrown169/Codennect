import { Collection, Db, WithId } from 'mongodb';
import { Request, RequestRepository, RequestType } from '../domain/Request.js';
import { isProd } from 'src/utils.js';

interface MongoRequest extends WithId<Document> {
    project_id: string;
    user_id: string;
    type: string;
    roles: string[];
    message: string;
}

export class MongoRequestRepository implements RequestRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('requests');
    }

    async GetRequest(
        user_id: string,
        project_id: string,
        is_invite: boolean
    ): Promise<Request | null> {
        let result = await this.collection.findOne<MongoRequest>({
            user_id: user_id,
            project_id: project_id,
            type: is_invite ? RequestType.INVITE : RequestType.APPLICATION,
        });

        if (result) {
            return new Request(
                result.project_id,
                result.user_id,
                result.type,
                result.roles,
                result.message
            );
        }

        return null;
    }

    async GetUserInvites(user_id: string): Promise<Request[]> {
        let result = await (
            await this.collection
                .find<MongoRequest>({
                    user_id: user_id,
                    type: RequestType.INVITE,
                })
                .toArray()
        ).map(
            (mr) =>
                new Request(
                    mr.project_id,
                    mr.user_id,
                    mr.type,
                    mr.roles,
                    mr.message
                )
        );
        return result;
    }

    async GetUserApplications(user_id: string): Promise<Request[]> {
        let result = await (
            await this.collection
                .find<MongoRequest>({
                    user_id: user_id,
                    type: RequestType.APPLICATION,
                })
                .toArray()
        ).map(
            (mr) =>
                new Request(
                    mr.project_id,
                    mr.user_id,
                    mr.type,
                    mr.roles,
                    mr.message
                )
        );
        return result;
    }

    async GetProjectInvites(project_id: string): Promise<Request[]> {
        let result = await (
            await this.collection
                .find<MongoRequest>({
                    project_id: project_id,
                    type: RequestType.INVITE,
                })
                .toArray()
        ).map(
            (mr) =>
                new Request(
                    mr.project_id,
                    mr.user_id,
                    mr.type,
                    mr.roles,
                    mr.message
                )
        );
        return result;
    }

    async GetProjectApplications(project_id: string): Promise<Request[]> {
        let result = await (
            await this.collection
                .find<MongoRequest>({
                    project_id: project_id,
                    type: RequestType.APPLICATION,
                })
                .toArray()
        ).map(
            (mr) =>
                new Request(
                    mr.project_id,
                    mr.user_id,
                    mr.type,
                    mr.roles,
                    mr.message
                )
        );
        return result;
    }

    async CreateRequest(req: Request): Promise<boolean> {
        let result = await this.collection.findOne<Request>({
            user_id: req.user_id,
            project_id: req.project_id,
            type: req.is_invite ? RequestType.INVITE : RequestType.APPLICATION,
        });
        if (result) {
            return false;
        } else {
            await this.collection.insertOne({
                user_id: req.user_id,
                project_id: req.project_id,
                type: req.is_invite
                    ? RequestType.INVITE
                    : RequestType.APPLICATION,
                roles: req.roles,
                message: req.message,
            });
            return true;
        }
    }

    async DeleteRequest(req: Request): Promise<boolean> {
        let result = await this.collection.deleteOne({
            user_id: req.user_id,
            project_id: req.project_id,
            type: req.is_invite ? RequestType.INVITE : RequestType.APPLICATION,
        });

        return result.deletedCount > 0;
    }
}
