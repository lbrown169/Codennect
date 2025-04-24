import { deleteRequest, getRequest, patchRequest } from './utils';

export async function getProject(project_id: string) {
    return await getRequest(`/api/projects/${project_id}`);
}

export async function removeUserFromProject(
    project_id: string,
    user_id: string
) {
    return await deleteRequest(`/api/projects/${project_id}/${user_id}`);
}

export async function updateProject(
    project_id: string,
    updates: Record<string, string | boolean | object>
) {
    return await patchRequest(`/api/projects/${project_id}`, {
        body: { updates: updates },
    });
}

export async function getSearchResults(q: Record<string, string>) {
    let header = {
        'Content-Type': 'application/json',
    };
    let option = {
        headers: header,
        query: q,
    };
    return await getRequest('/api/projects', option);
}
