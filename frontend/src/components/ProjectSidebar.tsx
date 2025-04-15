import { GoPersonFill } from "react-icons/go";
import { User, ProjectUsers, Project } from "../types";
import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { IoMailOpen } from "react-icons/io5";

export function ProjectSidebar({ owner, members, project }: {owner: User | undefined, members: ProjectUsers, project: Project}) {
    const ud = localStorage.getItem('user_data')
    const uid = JSON.parse(ud!).id;

    function isOwner() {
        return uid === project?.owner;
    }

    function isMember() {
        for (const key in project?.users) {
            if (project.users[key].includes(uid)) return true;
        }
        return false;
    }
    
    return (
        <div className="flex flex-col flex-1/3 max-w-120 gap-10 xl:gap-14">
                <div className="flex flex-col grow bg-[#EFF6E0] rounded-2xl text-black max-h-100 overflow-hidden">
                    <div className="flex bg-white items-center py-3 px-5 gap-2 rounded-t-2xl">
                        <GoPersonFill />
                        <h3 className="font-bold uppercase">Project Members</h3>
                    </div>
                    <div className="flex py-3 justify-center px-10 gap-5 border-white border-b-4">
                        <div className="self-center bg-[#5c8593] text-white rounded-4xl p-3">
                            <GoPersonFill className="w-8 h-8"/>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-500 uppercase text-xs">Project Owner</p>
                            <h2 className="text-xl">{owner?.name}</h2>
                        </div>
                    </div>
                    <div className="overflow-y-auto">
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
                        )}
                    </>
                )

                }
            </div>
    )
}