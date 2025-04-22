// import { IoCog } from 'react-icons/io5'
// import { Project } from '../types/Project'
// import { RiNumbersFill } from 'react-icons/ri'
// import { FaAtom } from 'react-icons/fa'

// export function ProjectDetails({ project }: { project: Project }) {
//     return (
//         <div className="flex flex-col grow bg-[#EFF6E0] rounded-2xl text-black">
//             <div className="flex bg-[#598392] text-white items-center py-3 px-5 gap-2 rounded-t-2xl">
//                 <IoCog />
//                 <h3 className="font-bold uppercase">Project Details</h3>
//             </div>
//             <div className="flex flex-col grow py-5 px-5 gap-5">
//                 <div className="flex flex-col justify-center">
//                     <p className="text-gray-500 uppercase text-xs">
//                         Project Name
//                     </p>
//                     <h1 className="font-bold">{project.name}</h1>
//                 </div>
//                 <div className="flex flex-col justify-center">
//                     <p className="text-gray-500 uppercase text-xs">
//                         Project Description
//                     </p>
//                     <h2 className="font-medium">{project.description}</h2>
//                 </div>
//                 <div className="flex wrap gap-5">
//                     {project.fields.map((field) => (
//                         <div
//                             className="flex flex-col justify-center"
//                             key={field.name}
//                         >
//                             <p className="text-gray-500 uppercase text-xs">
//                                 {field.name}
//                             </p>
//                             <h2 className="font-medium">{field.value}</h2>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div>
//                 <div className="flex bg-white items-center py-3 px-5 gap-2">
//                     <RiNumbersFill />
//                     <h3 className="font-bold uppercase">Project Capacity</h3>
//                 </div>
//                 <div className="flex flex-col py-7 px-7">
//                     {Object.keys(project.roles).map((role, index) => (
//                         <div
//                             className={`flex justify-between items-center border-gray-300 py-1 px-2 border-b-1 ${
//                                 index === 0 && 'border-t-1'
//                             }`}
//                             key={role}
//                         >
//                             <h2 className="text-xl font-medium">
//                                 {role} [{project.users[role]?.length || 0}/
//                                 {project.roles[role]}]
//                             </h2>
//                             <progress
//                                 className="w-80"
//                                 value={
//                                     (project.users[role]?.length || 0) /
//                                     project.roles[role]
//                                 }
//                             />
//                         </div>
//                     ))}
//                 </div>
//                 <div className="flex bg-white items-center py-3 px-5 gap-2">
//                     <FaAtom />
//                     <h3 className="font-bold uppercase">Project Skills</h3>
//                 </div>
//                 <div className="flex wrap py-5 px-5">
//                     {project.required_skills.map((skill, index) => (
//                         <span
//                             className="bg-[#5c8593] px-4 py-1 m-2 text-white font-bold rounded-3xl"
//                             key={index}
//                         >
//                             {skill}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }
