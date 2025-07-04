import { createContext } from 'react';
import { LoggedInUser } from '../types/User';
import { loadToken } from '../api/utils';
import { getMyInfo } from '../api/UserAPI';
import { getProject } from '../api/ProjectAPI';
import { RequestsResponse } from '../types/Request';
import { getRequests } from '../api/RequestsAPI';

type _UserContext = {
    user: LoggedInUser | null;
    setUser:
        | React.Dispatch<React.SetStateAction<LoggedInUser | null>>
        | (() => void);
    loaded: boolean;
    verified: boolean;
    setVerified: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    requests: RequestsResponse | null;
    setRequests:
        | React.Dispatch<React.SetStateAction<RequestsResponse | null>>
        | (() => void);
};

export const UserContext = createContext<_UserContext>({
    user: null,
    setUser: () => {},
    loaded: false,
    verified: true,
    setVerified: () => {},
    requests: null,
    setRequests: () => {},
});

export async function LoadData(
    setUser: React.Dispatch<React.SetStateAction<LoggedInUser | null>>,
    setVerified: React.Dispatch<React.SetStateAction<boolean>>,
    setRequests: React.Dispatch<React.SetStateAction<RequestsResponse | null>>
) {
    if (loadToken() === null) {
        setUser(null);
        return;
    }

    let response = await getMyInfo();
    if (response.status === 412) {
        setVerified(false);
        setUser(null);
    } else if (response.status !== 200) {
        console.log(await response.text());
        setVerified(true);
        setUser(null);
    } else {
        setVerified(true);
        const user = (await response.json()).result;
        const savedProjects = user.projects;
        user.projects = [];

        for (const pid of savedProjects) {
            const pResponse = await getProject(pid);
            if (pResponse.status === 200) {
                user.projects.push((await pResponse.json()).result);
            }
        }

        response = await getRequests();
        setRequests((await response.json()).result);

        setUser(user as LoggedInUser);
    }
}
