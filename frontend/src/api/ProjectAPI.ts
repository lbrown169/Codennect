import { getRequest } from './utils';

export async function getProject(project_id: string) {
    return await getRequest(`/api/projects/${project_id}`);
}
