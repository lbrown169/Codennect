import { Title, Box, Loader, Stack, Grid, Card, Group, Badge, Text, Alert, Button } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { LoadData, UserContext } from '../../hooks/UserContext';
import { MdOutlineEdit } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import EditProfileModal from '../../components/EditProfileModal';
import { Project } from '../../types/Project';
import { getProject } from '../../api/ProjectAPI';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { approveRequest, denyRequest } from '../../api/RequestsAPI';
import { notifications } from '@mantine/notifications';

export default function MyProfilePage() {
    const {user, requests, setUser, setVerified, setRequests } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);
    const [projectCache, setProjectCache] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (!requests) return;

            const tempCache: Project[] = [];
            for (const req of requests.invites.me) {
                if (!tempCache.find(p => p._id === req.project_id)) {
                    const projectResult = await getProject(req.project_id);
                    if (projectResult.status === 200) {
                        tempCache.push((await projectResult.json()).result);
                    }
                }
            }

            for (const req of requests.applications.me) {
                if (!tempCache.find(p => p._id === req.project_id)) {
                    const projectResult = await getProject(req.project_id);
                    if (projectResult.status === 200) {
                        tempCache.push((await projectResult.json()).result);
                    }
                }
            }

            console.log(requests);
            setProjectCache(tempCache);
        }

        fetchData();
    }, [requests])

    async function onRequestChange(pid: string, requestType: string, responseType: string) {
        if (!user) return;
        try {
            if (responseType === "deny") {
                await denyRequest(pid, user._id, requestType);
                notifications.show({
                    title: 'Request Denied',
                    message: 'The request has successfully been denied.',
                    color: 'green',
                });
            } else {
                await approveRequest(pid, user._id, requestType);
                notifications.show({
                    title: 'Request Approved',
                    message: 'The request has successfully been approved.',
                    color: 'green',
                });
            }
            await LoadData(setUser, setVerified, setRequests);
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to respond to the request, please try again later.',
                color: 'red',
            });
        }
    }

    if (!user) return <Loader />

    return (
        <>
            <EditProfileModal user={user} opened={opened} close={close} />
            <Box mx={{ base: 'md', lg: 'xl' }}>
                <div className="flex justify-between items-center">
                    <Title py="md" order={1}>
                        {user.name}'s Profile
                    </Title>
                    <MdOutlineEdit className='cursor-pointer' color='#5c8593' size={30} onClick={open} />
                </div>
                <Stack>
                    <Grid grow>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <p className="uppercase text-xs font-bold text-[#5c8593] pb-1">
                                    Skills
                                </p>
                                <Group gap="xs">
                                    {user.skills.map((skill) => (
                                        <Badge color="#5b8580" key={skill}>
                                            {skill}
                                        </Badge>
                                    ))}
                                </Group>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <p className="uppercase text-xs font-bold text-[#5c8593] pb-1">
                                    Primary Roles
                                </p>
                                <Group gap="xs">
                                    {user.roles.map((role) => (
                                        <Badge color="#5b8580" key={role}>
                                            {role}
                                        </Badge>
                                    ))}
                                </Group>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <p className="uppercase text-xs font-bold text-[#5c8593] pb-1">
                                    Preferred Communication Method
                                </p>
                                <Text c="dimmed">{user.comm}</Text>
                            </Card>
                        </Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <Title order={3}>Invites</Title>
                                {requests && requests.invites.me.length > 0 ? (
                                    requests.invites.me.map(invite => (
                                        <Stack className="bg-slate-100" key={`${invite.project_id}-${invite.user_id}`} gap={5} p="sm">
                                            <Text><Link to={`/projects/${invite.project_id}`}>{projectCache.find(p => p._id === invite.project_id)?.name}</Link></Text>
                                            <Text c="dimmed">{invite.roles.join(", ")}</Text>
                                            <Text>{invite.message}</Text>
                                            <Group grow>
                                                <Button color="#5c8593" onClick={() => onRequestChange(invite.project_id, "invite", "approve")}>Approve</Button>
                                                <Button color="red" onClick={() => onRequestChange(invite.project_id, "invite", "deny")}>Deny</Button>
                                            </Group>
                                        </Stack>
                                    ))
                                ) : (
                                    <Alert
                                        variant="light"
                                        color="#5c8593"
                                        title="No Project Invites"
                                        icon={<IoMdInformationCircleOutline />}
                                    >
                                        Head over to Browse Projects to start searching!
                                    </Alert>
                                )}
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <Title order={3}>Applications</Title>
                                {requests && requests.applications.me.length > 0 ? (
                                    requests.applications.me.map(application => (
                                        <Stack className="bg-slate-100" key={`${application.project_id}-${application.user_id}`} gap={5} p="sm">
                                            <Text><Link to={`/projects/${application.project_id}`}>{projectCache.find(p => p._id === application.project_id)?.name}</Link></Text>
                                            <Text c="dimmed">{application.roles.join(", ")}</Text>
                                            <Text>{application.message}</Text>
                                            <Group grow>
                                                <Button color="red" onClick={() => onRequestChange(application.project_id, "application", "deny")}>Deny</Button>
                                            </Group>
                                        </Stack>
                                    ))
                                ) : (
                                    <Alert
                                        variant="light"
                                        color="#5c8593"
                                        title="No Project Applications"
                                        icon={<IoMdInformationCircleOutline />}
                                    >
                                        Head over to Browse Projects to start searching!
                                    </Alert>
                                )}
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Box>
        </>
    );
}
