import { useEffect, useState } from "react"
import { isProd } from "../utils";

import { Project, ProjectUsers, User } from "../types";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectSidebar } from "./ProjectSidebar";

const app_name = "cop4331.tech";

function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

export function ProjectComp({ pid }: {pid: string}) {
    const [project, setProject] = useState<Project>();
    const [members, setMembers] = useState<ProjectUsers>({});
    const [owner, setOwner] = useState<User>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await fetch(buildPath('/api/get-project?' + new URLSearchParams({
                "id": pid
            }).toString()),
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            if (response.status === 401) {
                window.location.href = "/"
            }
            if (response.status !== 200) {
                setError(await response.text())
                setLoading(false);
                return;
            }
            setError("")
            setLoading(false);
            setProject(await response.json())
        }

        // setProject({
        //     "_id": "1234-5678",
        //     "name": "Testing Project",
        //     "domain": "",
        //     "owner": "0",
        //     "is_private": true,
        //     "description": "A testing project for a testing world",
        //     "fields": [
        //         {
        //             "name": "App URL",
        //             "value": "https://example.com",
        //             "private": false
        //         },
        //         {
        //             "name": "Github URL",
        //             "value": "https://github.com/lbrown169/Codennect",
        //             "private": false
        //         }
        //     ],
        //     "roles": {
        //         "Manager": 2,
        //         "Frontend": 2
        //     },
        //     "users": {
        //         "Manager": [
        //             "0"
        //         ]
        //     },
        //     "required_skills": ["React", "Next.js", "Flutter"]
        // })
        // setLoading(false);

        fetchData();
    }, [pid])

    useEffect(() => {
        async function fetchData() {
            if (!project) return;
            const response = await fetch(buildPath('/api/get-user-info?' + new URLSearchParams({
                "id": project.owner
            }).toString()),
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            if (response.status !== 200) {
                setError(await response.text())
                setLoading(false);
                return;
            }
            const data = await response.json();
            setOwner({ user_id: data._id, name: data.name })

            const tempMembers: {[ role: string ]: User[] } = {};
            for (const key in project?.users) {
                const uuids = Object.keys(project.users[key]);
                tempMembers[key] = [];

                for (const uuid in uuids) {
                    console.log(uuid)
                    const response = await fetch(buildPath('/api/get-user-info?' + new URLSearchParams({
                        "id": uuid
                    }).toString()),
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin'
                    });
                    if (response.status !== 200) {
                        setError(await response.text())
                        setLoading(false);
                        return;
                    }
                    const data = await response.json()
                    if (!tempMembers[key].some(u => u.user_id === data._id)) {
                        tempMembers[key].push({ name: data.name, user_id: data._id });
                    }
                }
            }

            setMembers(tempMembers)
        }

        // setOwner({"name": "Logan Brown", "user_id": "99"})
        // setMembers({
        //     "Backend": [{"name": "John Doe", "user_id": "0"}, {"name": "Jane Doe", "user_id": "1"}, {"name": "Jane Doe", "user_id": "2"}, {"name": "Jane Doe", "user_id": "3"}, {"name": "Jane Doe", "user_id": "4"}],
        //     "Frontend": [{"name": "Jane Doe", "user_id": "0"}, {"name": "John Doe", "user_id": "1"}],
        // })

        fetchData();
    }, [project])

    if (error) {
        return (
            <div id="projectDiv" className="accountBox">
                <h1>Oops!</h1>
                <p>That project couldn't be found. Maybe it was deleted?</p>
            </div>
        )
    }

    if (loading || !project) {
        return (
            <div id="projectDiv" className="accountBox">
                <h1>Loading project details</h1>
                <p>Hold on just a second while we load that project...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-row grow w-full p-20 gap-10 xl:gap-14">
            <ProjectDetails project={project} />
            <ProjectSidebar project={project} owner={owner} members={members} />
        </div>
    )
}