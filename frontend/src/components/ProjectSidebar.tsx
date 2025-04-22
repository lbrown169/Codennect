// import { GoPersonFill } from 'react-icons/go'
// import { User, ProjectUsers, Project, Request } from '../types'
// import { Link } from 'react-router-dom'
// import { RiAdminFill, RiCloseLargeFill } from 'react-icons/ri'
// import { MdGroups } from 'react-icons/md'
// import { IoMailOpen } from 'react-icons/io5'
// import { useEffect, useState } from 'react'
// import { isProd } from '../utils'

// const app_name = 'cop4331.tech'

// function buildPath(route: string): string {
//     if (isProd()) {
//         return 'http://' + app_name + route
//     } else {
//         return 'http://localhost:5001' + route
//     }
// }

// enum Mode {
//     SIDEBAR = 'sidebar',
//     REQUESTS = 'requests',
// }

// interface RequestsResponse {
//     invites: {
//         me: Request[]
//         [project_id: string]: Request[]
//     }
//     applications: {
//         me: Request[]
//         [project_id: string]: Request[]
//     }
// }

// export function ProjectSidebar({
//     members,
//     project,
//     setRefresh,
// }: {
//     members: ProjectUsers
//     project: Project
//     setRefresh: React.Dispatch<React.SetStateAction<string>>
// }) {
//     const [invites, setInvites] = useState<Request[]>([])
//     const [applications, setApplications] = useState<Request[]>([])
//     const [userCache, setUserCache] = useState<{ [user_id: string]: string }>(
//         {}
//     )
//     const [mode, setMode] = useState<Mode>(Mode.SIDEBAR)
//     const [roles, setRoles] = useState<{ [role: string]: boolean }>({})
//     const [message, setMessage] = useState('')
//     const ud = localStorage.getItem('user_data')
//     const uid = JSON.parse(ud!).id

//     function isOwner() {
//         return uid === project?.owner
//     }

//     function isMember() {
//         for (const key in project?.users) {
//             if (project.users[key].includes(uid)) return true
//         }
//         return false
//     }

//     async function fetchRequests() {
//         const response = await fetch(buildPath('/api/requests'), {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'same-origin',
//         })
//         if (response.status === 401) {
//             window.location.href = '/'
//         }
//         if (response.status !== 200) {
//             return
//         }
//         const data: RequestsResponse = await response.json()

//         if (isOwner()) {
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             setInvites(data.invites[project._id])
//             setApplications(data.applications[project._id])
//         } else {
//             for (const req of data.invites.me) {
//                 if (req.project_id === project._id) {
//                     setInvites([req])
//                     break
//                 }
//             }
//             for (const req of data.applications.me) {
//                 if (req.project_id === project._id) {
//                     setApplications([req])
//                     break
//                 }
//             }
//         }
//     }

//     useEffect(() => {
//         fetchRequests()
//     }, [])

//     useEffect(() => {
//         async function fetchData() {
//             const users: { [user_id: string]: string } = {}
//             for (const invite of invites) {
//                 if (users[invite.user_id]) continue
//                 const response = await fetch(
//                     buildPath(
//                         '/api/get-user-info?' +
//                             new URLSearchParams({
//                                 id: invite.user_id,
//                             }).toString()
//                     ),
//                     {
//                         method: 'GET',
//                         headers: { 'Content-Type': 'application/json' },
//                         credentials: 'same-origin',
//                     }
//                 )
//                 if (response.status !== 200) {
//                     return
//                 }
//                 const data: User = await response.json()
//                 if (data) {
//                     users[invite.user_id] = data.name
//                 }
//             }

//             for (const application of applications) {
//                 if (users[application.user_id]) continue
//                 const response = await fetch(
//                     buildPath(
//                         '/api/get-user-info?' +
//                             new URLSearchParams({
//                                 id: application.user_id,
//                             }).toString()
//                     ),
//                     {
//                         method: 'GET',
//                         headers: { 'Content-Type': 'application/json' },
//                         credentials: 'same-origin',
//                     }
//                 )
//                 if (response.status !== 200) {
//                     return
//                 }
//                 const data: User = await response.json()
//                 if (data) {
//                     users[application.user_id] = data.name
//                 }
//             }
//             setUserCache(users)
//         }

//         fetchData()
//     }, [invites, applications])

//     async function deny(user_id: string, is_invite: boolean) {
//         const response = await fetch(buildPath('/api/requests/deny'), {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'same-origin',
//             body: JSON.stringify({
//                 user_id: user_id,
//                 project_id: project._id,
//                 is_invite: is_invite,
//             }),
//         })
//         if (response.status !== 200) {
//             console.log(await response.text())
//             return
//         }

//         setRefresh(Math.random().toString()) // Force a refresh of the project and members
//         setInvites([])
//         setApplications([])
//         await fetchRequests()
//     }

//     async function approve(user_id: string, is_invite: boolean) {
//         const response = await fetch(buildPath('/api/requests/approve'), {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'same-origin',
//             body: JSON.stringify({
//                 user_id: user_id,
//                 project_id: project._id,
//                 is_invite: is_invite,
//             }),
//         })
//         if (response.status !== 200) {
//             console.log(await response.text())
//             return
//         }

//         setRefresh(Math.random().toString()) // Force a refresh of the project and members
//         setInvites([])
//         setApplications([])
//         await fetchRequests()
//     }

//     async function handleChangeRole(role: string) {
//         const update = { ...roles, [role]: !(role in roles && roles[role]) }
//         setRoles(update)
//     }

//     async function apply() {
//         const passingRoles = []
//         for (const role in roles) {
//             if (roles[role]) {
//                 passingRoles.push(role)
//             }
//         }
//         if (passingRoles.length === 0) {
//             alert('You must select at least one role')
//             return
//         }
//         const response = await fetch(buildPath('/api/requests'), {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'same-origin',
//             body: JSON.stringify({
//                 user_id: uid,
//                 project_id: project._id,
//                 is_invite: false,
//                 roles: passingRoles,
//                 message: message,
//             }),
//         })
//         if (response.status !== 200) {
//             console.log(await response.text())
//             return
//         }

//         setRefresh(Math.random().toString()) // Force a refresh of the project and members
//         setInvites([])
//         setApplications([])
//         await fetchRequests()
//     }

//     if (mode === Mode.SIDEBAR) {
//         return (
//             <div className="flex flex-col justify-between max-w-120 w-1/3 gap-10 xl:gap-14">
//                 <div className="flex flex-col grow bg-[#EFF6E0] rounded-2xl text-black max-h-9/12 overflow-hidden">
//                     <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                         <GoPersonFill />
//                         <h3 className="font-bold uppercase">Project Members</h3>
//                     </div>
//                     <div className="flex py-3 justify-center px-10 gap-5 border-white border-b-4">
//                         <div className="self-center bg-[#5c8593] text-white rounded-4xl p-3">
//                             <GoPersonFill className="w-8 h-8" />
//                         </div>
//                         <div className="flex flex-col justify-center">
//                             <p className="text-gray-500 uppercase text-xs">
//                                 Project Owner
//                             </p>
//                             <h2 className="text-xl">{owner?.name}</h2>
//                         </div>
//                     </div>
//                     <div className="overflow-y-auto">
//                         {Object.keys(members).length > 0 ? (
//                             Object.keys(members).map((role) => (
//                                 <div key={role}>
//                                     <div className="flex bg-white items-center py-3 px-5">
//                                         <h3 className="font-bold italic uppercase">
//                                             {role}
//                                         </h3>
//                                     </div>
//                                     <div className="flex flex-wrap justify-around py-3 px-5 gap-5">
//                                         {members[role].map((user) => (
//                                             <Link
//                                                 to={`/user/${user.user_id}`}
//                                                 key={`${role}-${user.user_id}`}
//                                             >
//                                                 <div className="flex flex-col">
//                                                     <div className="self-center bg-[#5c8593] text-white rounded-4xl p-3">
//                                                         <GoPersonFill className="w-8 h-8" />
//                                                     </div>
//                                                     <h3>{user.name}</h3>
//                                                 </div>
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="py-3 px-5">
//                                 <p>Loading project members...</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 {isOwner() ? (
//                     <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black">
//                         <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                             <RiAdminFill />
//                             <h3 className="font-bold uppercase">
//                                 Owner Settings
//                             </h3>
//                         </div>
//                         <div className="flex flex-col justify-between py-3 px-5">
//                             <p>Congrats, you're the owner of this project!</p>
//                             <button className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer">
//                                 Edit Project
//                             </button>
//                             <button
//                                 className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer"
//                                 onClick={() => setMode(Mode.REQUESTS)}
//                             >
//                                 View Project Requests
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {isMember() ? (
//                             <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black">
//                                 <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                                     <MdGroups />
//                                     <h3 className="font-bold uppercase">
//                                         Member Settings
//                                     </h3>
//                                 </div>
//                                 <div className="flex flex-col grow justify-between py-3 px-5">
//                                     <p>
//                                         Congrats, you're a part of this project!
//                                         Keep working on great things.
//                                     </p>
//                                     <button className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer">
//                                         Leave Project
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col grow bg-[#EFF6E0] rounded-2xl text-black">
//                                 <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                                     <IoMailOpen />
//                                     <h3 className="font-bold uppercase">
//                                         Submit Application
//                                     </h3>
//                                 </div>
//                                 <div className="flex flex-col grow py-3 px-5">
//                                     {invites.length === 0 &&
//                                     applications.length === 0 ? (
//                                         <>
//                                             {Object.keys(members).length > 0 ? (
//                                                 <div className="flex flex-col grow gap-2">
//                                                     <textarea
//                                                         className="grow bg-white p-3 rounded text-xs resize-none"
//                                                         placeholder="Message"
//                                                         value={message}
//                                                         onChange={(e) =>
//                                                             setMessage(
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                     />
//                                                     <div className="flex gap-2">
//                                                         {Object.keys(
//                                                             project.roles
//                                                         ).map((role) => (
//                                                             <label
//                                                                 key={role}
//                                                                 className="flex justify-between gap-1 bg-[#5c8593] px-4 py-1 text-white font-bold rounded-3xl"
//                                                             >
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() =>
//                                                                         handleChangeRole(
//                                                                             role
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 {role}
//                                                             </label>
//                                                         ))}
//                                                     </div>
//                                                     <input
//                                                         type="submit"
//                                                         className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] my-2 hover:bg-[#90b0bb] hover:cursor-pointer"
//                                                         value="Apply"
//                                                         onClick={() => apply()}
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <p>
//                                                     Applications are not open
//                                                     for this project because the
//                                                     owner has not created any
//                                                     roles.
//                                                 </p>
//                                             )}
//                                         </>
//                                     ) : invites.length === 0 ? (
//                                         <>
//                                             <p>
//                                                 Looks like you have an active
//                                                 application for this project.
//                                                 We'll send you an email when the
//                                                 project owner approves or denies
//                                                 your request!
//                                             </p>
//                                             <p>
//                                                 Roles:{' '}
//                                                 {applications[0].roles.join(
//                                                     ', '
//                                                 )}
//                                             </p>
//                                         </>
//                                     ) : applications.length === 0 ? (
//                                         <>
//                                             <p>
//                                                 The owner of this project has
//                                                 invited you to join!
//                                             </p>
//                                             <p>
//                                                 Roles:{' '}
//                                                 {invites[0].roles.join(', ')}
//                                             </p>
//                                             <div className="flex gap-2 items-stretch">
//                                                 <button
//                                                     className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                                     onClick={() =>
//                                                         approve(uid, true)
//                                                     }
//                                                 >
//                                                     Approve
//                                                 </button>
//                                                 <button
//                                                     className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                                     onClick={() =>
//                                                         deny(uid, true)
//                                                     }
//                                                 >
//                                                     Deny
//                                                 </button>
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <p>
//                                                 The owner of this project has
//                                                 invited you to join!
//                                             </p>
//                                             <p>
//                                                 Roles:{' '}
//                                                 {invites[0].roles.join(', ')}
//                                             </p>
//                                             <div className="flex gap-2 items-stretch">
//                                                 <button
//                                                     className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                                     onClick={() =>
//                                                         approve(uid, true)
//                                                     }
//                                                 >
//                                                     Approve
//                                                 </button>
//                                                 <button
//                                                     className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                                     onClick={() =>
//                                                         deny(uid, true)
//                                                     }
//                                                 >
//                                                     Deny
//                                                 </button>
//                                             </div>
//                                             <p>
//                                                 You also have a current
//                                                 application to join the project:
//                                             </p>
//                                             <p>
//                                                 Roles:{' '}
//                                                 {applications[0].roles.join(
//                                                     ', '
//                                                 )}
//                                             </p>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         )
//     } else {
//         return (
//             <div className="flex flex-col bg-[#EFF6E0] rounded-2xl text-black overflow-hidden max-w-120 w-1/3">
//                 <div className="flex justify-between bg-[#598392] text-white py-3 px-5 rounded-t-2xl">
//                     <div className="flex items-center gap-2">
//                         <IoMailOpen />
//                         <h3 className="font-bold uppercase">
//                             Project Requests
//                         </h3>
//                     </div>
//                     <button
//                         className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                         onClick={() => setMode(Mode.SIDEBAR)}
//                     >
//                         <RiCloseLargeFill />
//                     </button>
//                 </div>
//                 <div className="flex-[1_0_0] flex-col justify-between overflow-y-auto">
//                     <div className="flex bg-white items-center py-3 px-5 gap-2">
//                         <h3 className="font-bold uppercase italic">Invites</h3>
//                     </div>
//                     {Object.keys(invites).length > 0 ? (
//                         invites.map((invite) => (
//                             <div
//                                 className="flex flex-col py-3 px-5 gap-2"
//                                 key={`${invite.project_id}-${invite.user_id}`}
//                             >
//                                 <div className="flex justify-between">
//                                     <div className="flex gap-2 items-center">
//                                         <div className="bg-[#5c8593] text-white rounded-4xl p-2">
//                                             <GoPersonFill className="w-4 h-4" />
//                                         </div>
//                                         <Link to={`/user/${invite.user_id}`}>
//                                             <h3>
//                                                 {userCache[invite.user_id] ??
//                                                     invite.user_id}
//                                             </h3>
//                                         </Link>
//                                     </div>
//                                     <div className="flex gap-2 items-center">
//                                         <button
//                                             className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                             onClick={() =>
//                                                 deny(invite.user_id, true)
//                                             }
//                                         >
//                                             Deny
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <p>{invite.message}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="py-3 px-5">
//                             <p>No current invites!</p>
//                         </div>
//                     )}
//                     <div className="flex bg-white items-center py-3 px-5 gap-2">
//                         <h3 className="font-bold uppercase italic">
//                             Applications
//                         </h3>
//                     </div>
//                     {Object.keys(applications).length > 0 ? (
//                         applications.map((application) => (
//                             <div
//                                 className="flex flex-col py-3 px-5 gap-2"
//                                 key={`${application.project_id}-${application.user_id}`}
//                             >
//                                 <div className="flex justify-between">
//                                     <div className="flex gap-2 items-center">
//                                         <div className="bg-[#5c8593] text-white rounded-4xl p-2">
//                                             <GoPersonFill className="w-4 h-4" />
//                                         </div>
//                                         <Link
//                                             to={`/user/${application.user_id}`}
//                                         >
//                                             <h3>
//                                                 {userCache[
//                                                     application.user_id
//                                                 ] ?? application.user_id}
//                                             </h3>
//                                         </Link>
//                                     </div>
//                                     <div className="flex gap-2 items-center">
//                                         <button
//                                             className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                             onClick={() =>
//                                                 approve(
//                                                     application.user_id,
//                                                     false
//                                                 )
//                                             }
//                                         >
//                                             Approve
//                                         </button>
//                                         <button
//                                             className="bg-[#598392] text-white font-bold px-4 py-1 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                                             onClick={() =>
//                                                 deny(application.user_id, false)
//                                             }
//                                         >
//                                             Deny
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <p>{application.message}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="py-3 px-5">
//                             <p>No current applications!</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         )
//     }
// }
