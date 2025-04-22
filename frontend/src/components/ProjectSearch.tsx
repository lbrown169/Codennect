// import React, { useEffect, useState } from 'react'
// //import {Link} from 'react-router-dom';
// import { isProd } from '../utils'
// import { FaArrowRight, FaSearch } from 'react-icons/fa'
// import { GoProjectRoadmap } from 'react-icons/go'
// import { Link } from 'react-router-dom'

// const app_name = 'cop4331.tech'

// function buildPath(route: string): string {
//     if (isProd()) {
//         return 'http://' + app_name + route
//     } else {
//         return 'http://localhost:5001' + route
//     }
// }

// type FieldDetails = {
//     name: string
//     value: string
//     private: boolean
// }

// interface Project {
//     _id: string
//     name: string
//     domain: string
//     owner: string
//     is_private: boolean
//     description: string
//     fields: FieldDetails[]
//     roles: { [role: string]: number }
//     users: { [role: string]: string[] }
//     required_skills: string[]
// }

// function ProjectSearch() {
//     const [searchInfo, setSearchInfo] = useState('')
//     // const [searchFilter, setSearchFilter] = useState('');
//     const [projects, setProjects] = useState<Project[]>([
//         {
//             _id: '1234-5678',
//             name: 'Codennect',
//             domain: '',
//             owner: '',
//             is_private: false,
//             description:
//                 'A testing project for a testing world, with a testing long description for a testing-ly long purpose.',
//             fields: [],
//             roles: { Frontend: 2, Backend: 2 },
//             users: { Frontend: [], Backend: [] },
//             required_skills: ['MongoDB', 'Express', 'React', 'Node.js'],
//         },
//     ])

//     const handleSetSearchInfo = (
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         setSearchInfo(event.target.value)
//     }

//     // const handleSetSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) =>
//     // {
//     //     setSearchFilter(event.target.value);
//     // }

//     const doSearch = async () => {
//         try {
//             let query = ''
//             if (searchInfo) {
//                 query += '?'
//                 query += new URLSearchParams({ name: searchInfo }).toString()
//             }
//             const response = await fetch(
//                 buildPath('/api/get-all-projects' + query),
//                 {
//                     method: 'GET',
//                     headers: { 'Content-Type': 'application/json' },
//                     credentials: 'same-origin',
//                 }
//             )

//             if (response.status === 401) {
//                 window.location.href = '/'
//                 return
//             }

//             const res = await response.json()

//             if (res.error) {
//                 alert(res.error)
//                 return
//             }

//             setProjects(res)
//         } catch (error: any) {
//             alert(error)
//             console.log(error)
//         }
//     }

//     useEffect(() => {
//         doSearch()
//     }, [])

//     const _ud = localStorage.getItem('user_data')
//     if (_ud == null) {
//         //redirect if user not found
//         window.location.href = '/'
//         return
//     }

//     function getCapacityString(project: Project) {
//         let numFilled = 0
//         for (const role in project.users) {
//             numFilled += project.users[role].length
//         }
//         let numTotal = 0
//         for (const role in project.roles) {
//             numTotal += project.roles[role]
//         }

//         return `[${numFilled}/${numTotal}]`
//     }

//     function getOpenRoles(project: Project) {
//         const roles: string[] = []
//         for (const role in project.roles) {
//             if (!project.users[role]) {
//                 roles.push(role)
//                 continue
//             }
//             if (project.roles[role] > project.users[role].length) {
//                 roles.push(role)
//             }
//         }
//         return roles.join(', ') ?? 'None'
//     }

//     return (
//         <div className="flex m-20 gap-10 items-start overflow-hidden">
//             <div className="flex flex-col w-1/3 bg-[#EFF6E0] rounded-2xl text-black">
//                 <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                     <FaSearch />
//                     <h3 className="font-bold uppercase">Search</h3>
//                 </div>
//                 <div className="flex flex-col items-stretch p-5 gap-2">
//                     <p className="italic">
//                         Just a search away from your next big idea...
//                     </p>
//                     <form action={doSearch} className="flex items-center gap-2">
//                         <input
//                             className="grow px-2 py-1"
//                             type="text"
//                             id="searchBar"
//                             placeholder="Search Projects"
//                             value={searchInfo}
//                             onChange={handleSetSearchInfo}
//                         />
//                         <button
//                             className="bg-[#598392] text-white px-2 py-2 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer"
//                             type="submit"
//                         >
//                             <FaSearch />
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             <div className="flex flex-col w-2/3 max-h-full bg-[#EFF6E0] rounded-2xl overflow-hidden">
//                 <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                     <GoProjectRoadmap />
//                     <h3 className="font-bold uppercase">Projects</h3>
//                 </div>

//                 <div className="overflow-y-scroll">
//                     {projects.map((project) => (
//                         <div
//                             key={project._id}
//                             className="m-4 border-white border-4 rounded-xl text-black"
//                         >
//                             <div className="flex bg-white items-center justify-between py-2 px-4 gap-2">
//                                 <Link to={`/projects/${project._id}`}>
//                                     <h3 className="font-bold text-xl">
//                                         {getCapacityString(project)}{' '}
//                                         {project.name}
//                                     </h3>
//                                 </Link>
//                                 <Link to={`/projects/${project._id}`}>
//                                     <button className="bg-[#598392] text-white px-2 py-2 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer">
//                                         <FaArrowRight />
//                                     </button>
//                                 </Link>
//                             </div>
//                             <div className="flex flex-col py-4 px-6 gap-5 justify-between">
//                                 <div className="flex flex-col flex-[1_0_0] justify-center">
//                                     <p className="text-gray-500 uppercase text-xs">
//                                         Project Description
//                                     </p>
//                                     <h2 className="font-medium text-wrap">
//                                         {project.description}
//                                     </h2>
//                                 </div>
//                                 <div className="flex grow gap-10 items-start">
//                                     <div className="flex flex-col flex-[1_0_0] justify-center">
//                                         <p className="text-gray-500 uppercase text-xs">
//                                             Open Roles
//                                         </p>
//                                         <h2 className="font-medium text-wrap">
//                                             {getOpenRoles(project)}
//                                         </h2>
//                                     </div>
//                                     <div className="flex flex-col flex-[1_0_0] justify-center">
//                                         <p className="text-gray-500 uppercase text-xs">
//                                             Skills
//                                         </p>
//                                         <h2 className="font-medium text-wrap">
//                                             {project.required_skills.join(
//                                                 ', '
//                                             ) || 'None'}
//                                         </h2>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default ProjectSearch
