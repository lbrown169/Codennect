import { useEffect, useState } from 'react'

// import { ProjectDetails } from './ProjectDetails'
// import { ProjectSidebar } from './ProjectSidebar'
import { getProject } from '../api/ProjectAPI'
import { Project } from '../types/Project'
import { User } from '../types/User'
import { getUserInfo } from '../api/UserAPI'

export function ProjectComp({ pid }: { pid: string }) {
    const [project, setProject] = useState<Project | null>()
    const [members, setMembers] = useState<User[]>([])
    const [error, _setError] = useState('')
    const [loading, setLoading] = useState(true)

    const [refresh, _setRefresh] = useState('')

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const projectResponse = await getProject(pid)
            if (projectResponse.status === 200) {
                setProject((await projectResponse.json()).result)
            }
            setLoading(false)
        }

        fetchData()
    }, [pid, refresh])

    useEffect(() => {
        async function fetchData() {
            if (!project) return

            const tempMembers: User[] = []

            let response = await getUserInfo(project.owner)
            if (response.status === 200) {
                tempMembers.push((await response.json()) as User)
            }

            for (const role in project.users) {
                for (const user of project.users[role].users) {
                    if (!tempMembers.find((member) => member._id === user)) {
                        response = await getUserInfo(user)
                        if (response.status === 200) {
                            tempMembers.push((await response.json()) as User)
                        }
                    }
                }
            }

            setMembers(tempMembers)
            console.log(project)
            console.log(members)
        }

        fetchData()
    }, [project])

    if (error) {
        return (
            <div id="projectDiv" className="accountBox">
                <h1>Oops!</h1>
                <p>That project couldn't be found. Maybe it was deleted?</p>
                <p>{error}</p>
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
        <div className="flex flex-row grow m-20 gap-10 xl:gap-14">
            {/* <ProjectDetails project={project} />
            <ProjectSidebar
                project={project}
                members={members}
                setRefresh={setRefresh}
            /> */}
        </div>
    )
}
