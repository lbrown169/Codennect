import { getRequest } from './utils';

export async function getProject(project_id: string) {
    return await getRequest(`/api/projects/${project_id}`);
}

export async function getSearchResults(q: Record<string,string>) {
    let header = {
        'Content-Type': 'application/json',
    }
    let option = {
        headers: header,
        query: q,
    }
    return await getRequest('/api/projects', option);
}

