import { useContext, useEffect, useState } from 'react';

// import { ProjectDetails } from './ProjectDetails'
// import { ProjectSidebar } from './ProjectSidebar'
import { getProject } from '../../api/ProjectAPI';
import { Project } from '../../types/Project';
import { User } from '../../types/User';
import { getUserInfo } from '../../api/UserAPI';
import { Alert, Group, Paper, Stack, Tabs, Text } from '@mantine/core';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import ProjectHeader from './ProjectHeader';
import { UserContext } from '../../hooks/UserContext';
import { MembersTabPanel } from './MembersTab';
import { FieldsTab } from './FieldsTab';
import { ApplicationTab } from './ApplicationTab';
import { OwnerTab } from './OwnerTab';

export function ProjectComp({ pid }: { pid: string }) {
    const { user, requests } = useContext(UserContext);
    const [project, setProject] = useState<Project | null>();
    const [members, setMembers] = useState<User[]>([]);
    const [error, _setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [refresh, setRefresh] = useState('');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const projectResponse = await getProject(pid);
            if (projectResponse.status === 200) {
                setProject((await projectResponse.json()).result);
            }
            setLoading(false);
        }

        fetchData();
    }, [pid, refresh]);

    useEffect(() => {
        async function fetchData() {
            if (!project) return;

            const tempMembers: User[] = [];

            let response = await getUserInfo(project.owner);
            if (response.status === 200) {
                tempMembers.push((await response.json()).result as User);
            }

            for (const role in project.users) {
                for (const user of project.users[role].users) {
                    if (!tempMembers.find((member) => member._id === user)) {
                        response = await getUserInfo(user);
                        if (response.status === 200) {
                            tempMembers.push((await response.json()).result as User);
                        }
                    }
                }
            }

            if (requests) {
                for (const invite of requests.invites[project._id] || []) {
                    if (!tempMembers.find((member) => member._id === invite.user_id)) {
                        response = await getUserInfo(invite.user_id);
                        if (response.status === 200) {
                            tempMembers.push((await response.json()).result as User);
                        }
                    }
                }
            }

            setMembers(tempMembers);
            console.log(project);
            console.log(tempMembers);
        }

        fetchData();
    }, [project, requests]);

    function getFillPercentage() {
        // We are going to do total - amount of open positions, so that an over in one category doesn't affect another
        if (!project) {
            return { total: 0, open: 0};
        }
        let total = 0;
        let open = 0;

        for (const role in project.users) {
            total += project.users[role].max;
            open += Math.max(0, project.users[role].max - project.users[role].users.length);
        }

        return { total, open }
    }

    function getRelationship() {
        if (!project || !user) return "";
        if (project.owner === user._id) {
            return "owner"
        } else if (Object.values(project.users).map(role => role.users.includes(user._id)).includes(true)) {
            return "member"
        } else {
            return "stranger"
        }
    }

    if (error) {
        return (
            <Alert
                variant="light"
                color="red"
                title="Failed to load project details"
                icon={<MdErrorOutline />}>
                <Group>
                    <Text>{error}</Text>
                </Group>
            </Alert>
        );
    }

    if (loading) {
        return (
            <Alert
                variant="light"
                color="#5c8593"
                title="Hold on just a second"
                icon={<IoMdInformationCircleOutline />}>
                <Group>
                    <Text>Loading project details...</Text>
                </Group>
            </Alert>
        );
    }

    if (!project) {
        return (
            <Alert
                variant="light"
                color="yellow"
                title="Failed to load project details"
                icon={<IoMdInformationCircleOutline />}>
                <Group>
                    <Text>Looks like that project doesn't exist. Maybe a bad link?</Text>
                </Group>
            </Alert>
        );
    }

    return (
        <Stack>
            <ProjectHeader title={project.name} description={project.description} skills={project.required_skills} fill={getFillPercentage()} owner={members.find(m => m._id === project.owner)} />
            <Paper shadow="md" radius="md" p="md">
                <Tabs color="#5c8593" defaultValue="members">
                    <Tabs.List>
                        <Tabs.Tab value="members">Project Members</Tabs.Tab>
                        <Tabs.Tab value="fields">Project Fields</Tabs.Tab>
                        <Tabs.Tab value="application">Submit Application</Tabs.Tab>

                        {getRelationship() === "owner" ? (
                            <Tabs.Tab value="owner">Owner Settings</Tabs.Tab>
                        ) : getRelationship() === "member" ? (
                            // <Tabs.Tab value="member">Member Settings</Tabs.Tab>
                            <></>
                        ) : (
                            <></>
                        )}
                    </Tabs.List>

                    <MembersTabPanel members={project.users} cache={members} />
                    <FieldsTab fields={project.fields} />
                    <ApplicationTab pid={pid} />
                    <OwnerTab project={project} setRefresh={setRefresh} cache={members} />
                </Tabs>
            </Paper>
        </Stack>
    );
}
