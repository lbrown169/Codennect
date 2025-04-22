import { Request, RequestRepository, RequestType } from '../domain/Request.js'

export class StaticRequestRepository implements RequestRepository {
    private _internal: Request[] = [
        new Request(
            '1234-5678',
            '1',
            RequestType.APPLICATION,
            ['Frontend'],
            'Would love to join frontend!'
        ),
        new Request(
            '1234-5678',
            '1',
            RequestType.INVITE,
            ['Frontend'],
            'Would love to have you join frontend!'
        ),
    ]

    async GetRequest(
        user_id: string,
        project_id: string,
        is_invite: boolean
    ): Promise<Request | null> {
        return (
            this._internal.find(
                (req: Request) =>
                    req.user_id === user_id &&
                    req.project_id == project_id &&
                    req.is_invite == is_invite
            ) || null
        )
    }

    async GetUserInvites(user_id: string): Promise<Request[]> {
        return this._internal.filter(
            (req: Request) => req.user_id === user_id && req.is_invite
        )
    }

    async GetUserApplications(user_id: string): Promise<Request[]> {
        return this._internal.filter(
            (req: Request) => req.user_id === user_id && req.is_application
        )
    }

    async GetProjectInvites(project_id: string): Promise<Request[]> {
        return this._internal.filter(
            (req: Request) => req.project_id === project_id && req.is_invite
        )
    }

    async GetProjectApplications(project_id: string): Promise<Request[]> {
        return this._internal.filter(
            (req: Request) =>
                req.project_id === project_id && req.is_application
        )
    }

    async CreateRequest(req: Request): Promise<boolean> {
        if (
            this._internal.find(
                (found: Request) =>
                    found.user_id === req.user_id &&
                    found.project_id === req.project_id &&
                    found.is_invite === req.is_invite
            )
        ) {
            return false
        } else {
            this._internal.push(req)
            return true
        }
    }

    async DeleteRequest(req: Request): Promise<boolean> {
        let size = this._internal.length

        this._internal = this._internal.filter(
            (found: Request) =>
                found.user_id !== req.user_id ||
                found.project_id !== req.project_id ||
                found.is_invite !== req.is_invite
        )

        return size !== this._internal.length
    }
}
