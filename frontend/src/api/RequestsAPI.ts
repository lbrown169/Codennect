import { getRequest, postRequest } from './utils';

export async function getRequests() {
    return await getRequest(`/api/requests`);
}

export async function createRequest(
    pid: string,
    uid: string,
    type: string,
    roles: string[],
    message: string
) {
    return await postRequest('/api/requests', {
        body: {
            user_id: uid,
            project_id: pid,
            is_invite: type === 'invite',
            roles: roles,
            message: message,
        },
    });
}

export async function denyRequest(pid: string, uid: string, type: string) {
    return await postRequest('/api/requests/deny', {
        body: {
            user_id: uid,
            project_id: pid,
            is_invite: type === 'invite',
        },
    });
}

export async function approveRequest(pid: string, uid: string, type: string) {
    return await postRequest('/api/requests/approve', {
        body: {
            user_id: uid,
            project_id: pid,
            is_invite: type === 'invite',
        },
    });
}
