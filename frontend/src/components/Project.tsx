import { useEffect, useState } from "react"
import { isProd } from "../utils";
import { GoPersonFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { IoCog, IoMailOpen } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { RiAdminFill, RiNumbersFill } from "react-icons/ri";
import { FaAtom } from "react-icons/fa";

const app_name = "cop4331.tech";

function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

type FieldDetails = {
    name: string;
    value: string;
    private: boolean;
};

interface Project {
    _id: string
    name: string
    domain: string
    owner: string
    is_private: boolean
    description: string
    fields: FieldDetails[]
    roles: { [role: string]: number }
    users: { [role: string]: string[] }
    required_skills: string[]
}

interface User {
    user_id: string;
    name: string;
}

interface ProjectUsers {
    [role: string]: User[]
}

export function Project({ pid }: {pid: string}) {
    const [project, setProject] = useState<Project>();
    const [members, setMembers] = useState<ProjectUsers>({});
    const [owner, setOwner] = useState<User>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const ud = localStorage.getItem('user_data')
    const uid = JSON.parse(ud!).id;

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

    function isOwner() {
        return uid === project?.owner;
    }

    function isMember() {
        for (const key in project?.users) {
            if (project.users[key].includes(uid)) return true;
        }
        return false;
    }

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
            <div className="flex flex-col flex-2/3 bg-[#EFF6E0] rounded-2xl text-black">
                <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                    <IoCog />
                    <h3 className="font-bold uppercase">Project Details</h3>
                </div>
                <div className="flex flex-col grow py-5 px-5 gap-5">
                    <div className="flex flex-col justify-center">
                        <p className="text-gray-500 uppercase text-xs">Project Name</p>
                        <h1 className="font-bold">{project.name}</h1>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-gray-500 uppercase text-xs">Project Description</p>
                        <h2 className="font-medium">{project.description}</h2>
                    </div>
                    <div className="flex wrap gap-5">
                        {project.fields.map((field) => (
                            <div className="flex flex-col justify-center" key={field.name}>
                                <p className="text-gray-500 uppercase text-xs">{field.name}</p>
                                <h2 className="font-medium">{field.value}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex bg-white items-center py-3 px-5 gap-2">
                        <RiNumbersFill />
                        <h3 className="font-bold uppercase">Project Capacity</h3>
                    </div>
                    <div className="flex flex-col py-7 px-7">
                        {Object.keys(project.roles).map((role, index) => (
                            <div className={`flex justify-between items-center border-gray-300 py-1 px-2 border-b-1 ${index === 0 && "border-t-1"}`} key={role}>
                                <h2 className="text-xl font-medium">{role} [{(project.users[role]?.length || 0)}/{project.roles[role]}]</h2>
                                <progress className="w-80" value={(project.users[role]?.length || 0) / project.roles[role]} />
                            </div>
                        ))}
                    </div>
                    <div className="flex bg-white items-center py-3 px-5 gap-2">
                        <FaAtom />
                        <h3 className="font-bold uppercase">Project Skills</h3>
                    </div>
                    <div className="flex wrap py-5 px-5">
                        {project.required_skills.map((skill, index) => (
                            <span className="bg-[#5c8593] px-4 py-1 m-2 text-white font-bold rounded-3xl" key={index}>{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1/3 max-w-120 gap-10 xl:gap-14">
                <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black">
                    <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                        <GoPersonFill />
                        <h3 className="font-bold uppercase">Project Members</h3>
                    </div>
                    <div className="flex py-3 justify-center px-10 gap-5">
                        <div className="self-center bg-[#5c8593] text-white rounded-4xl p-3">
                            <GoPersonFill className="w-8 h-8"/>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-500 uppercase text-xs">Project Owner</p>
                            <h2 className="text-xl">{owner?.name}</h2>
                        </div>
                    </div>
                    <div className="shrink overflow-y-auto">
                        {Object.keys(members).length > 0 ? (
                            Object.keys(members).map((role) => (
                                <div key={role}>
                                    <div className="flex bg-white items-center py-3 px-5">
                                        <h3 className="font-bold italic uppercase">{role}</h3>
                                    </div>
                                    <div className="flex flex-wrap justify-around py-3 px-5 gap-5">
                                        {members[role].map((user) => (
                                            <Link to={`/user/${user.user_id}`} key={`${role}-${user.user_id}`}>
                                                <div className="flex flex-col">
                                                    <div className="self-center bg-[#5c8593] text-white rounded-4xl p-3">
                                                        <GoPersonFill className="w-8 h-8"/>
                                                    </div>
                                                    <h3>{user.name}</h3>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-3 px-5">
                                <p>Loading project members...</p>
                            </div>
                        )}
                    </div>
                </div>
                {isOwner() ? (
                    <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black">
                        <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                            <RiAdminFill />
                            <h3 className="font-bold uppercase">Owner Settings</h3>
                        </div>
                        <div className="flex flex-col grow justify-between py-3 px-5">
                            <p>Congrats, you're the owner of this project!</p>
                            <button className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer">
                                Edit Project
                            </button>
                            <button className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer">
                                View Project Requests
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {isMember() ? (
                            <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black">
                                <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                                    <MdGroups />
                                    <h3 className="font-bold uppercase">Member Settings</h3>
                                </div>
                                <div className="flex flex-col grow justify-between py-3 px-5">
                                    <p>Congrats, you're a part of this project! Keep working on great things.</p>
                                    <button className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer">
                                        Leave Project
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col grow bg-[#EFF6E0] rounded-2xl text-black">
                                <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                                    <IoMailOpen />
                                    <h3 className="font-bold uppercase">Submit Application</h3>
                                </div>
                                <div className="flex flex-col grow py-3 px-5">
                                    <textarea
                                        className="grow bg-white p-3 rounded text-xs resize-none"
                                        placeholder="Message"
                                    />
                                    <input
                                        type="submit"
                                        className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer"
                                        value="Apply"
                                    />
                                </div>
                            </div>
                        )

                        }
                    </>
                )

                }
            </div>
        </div>
    )
}