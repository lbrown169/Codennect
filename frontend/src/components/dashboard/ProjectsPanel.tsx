import { useContext } from 'react';
import { Project } from '../../types/Project';
import { UserContext } from '../../hooks/UserContext';
import {
    Alert,
    Badge,
    Card,
    Divider,
    Grid,
    Group,
    Loader,
    Progress,
    ScrollArea,
    Skeleton,
    Stack,
    Tabs,
    Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';

export function ProjectCard({ project }: { project: Project }) {
    const { user } = useContext(UserContext);
    let filled = 0;
    let total = 0;

    for (const roleDetails of Object.values(project.users)) {
        total += roleDetails.max;
        filled += roleDetails.users.length;
    }

    const isOwner = project.owner === user!._id;

    return (
        <Card
            className="h-full gap-3"
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
        >
            <Stack className='grow'>
                <Group justify="space-between" mb="xs">
                    <Group>
                        {isOwner && <LuCrown color="#598392" />}
                        <Link to={`/projects/${project._id}`}>
                            <Text fw={500}>{project.name}</Text>
                        </Link>
                    </Group>
                    <Badge color="#598392">
                        {total - filled}/{total} Open
                    </Badge>
                </Group>
                <Text size="md">{project.description}</Text>
            </Stack>
            <Divider />
            <Stack gap="xs">
                {Object.keys(project.users).map((role) => (
                    <Group justify="space-between" key={role}>
                        <Text size="sm" c="dimmed">
                            {role}
                        </Text>
                        <Progress
                            color="#5b8580"
                            className="w-28"
                            value={
                                (project.users[role].users.length /
                                    project.users[role].max) *
                                100
                            }
                        />
                    </Group>
                ))}
            </Stack>
            <Divider />
            <Group>
                {project.required_skills.slice(0, 6).map((skill) => (
                    <Badge color="#5b8580" key={skill}>
                        {skill}
                    </Badge>
                ))}
            </Group>
        </Card>
    );
}

export function OwnedProjectsPanel() {
    const { user } = useContext(UserContext);

    if (!user) {
        return (
            <Tabs.Panel value="owned" px="sm" py="lg">
                <Loader />
            </Tabs.Panel>
        )
    }

    const projects = user.projects.filter(
        (project) => project.owner === user._id
    );

    return (
        <Tabs.Panel value="owned" px="sm" py="lg">
            <ScrollArea type="never" scrollbars="y">
                {projects.length > 0 ? (
                    <Grid align="stretch">
                        {projects.map((project) => (
                            <Grid.Col
                                span={{ base: 12, md: 6, lg: 4 }}
                                key={project._id}
                            >
                                <ProjectCard project={project} />
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Alert
                        variant="light"
                        color="#5c8593"
                        title="Looks like you aren't the owner of any projects."
                        icon={<IoMdInformationCircleOutline />}
                    >
                        Have a great idea? Head over to our{' '}
                        <Link to="/projects/create">Create Project</Link> page
                        to get started.
                    </Alert>
                )}
            </ScrollArea>
        </Tabs.Panel>
    );
}

export function MemberedProjectsPanel() {
    const { user } = useContext(UserContext);

    if (!user) {
        return (
            <Tabs.Panel value="membered" px="sm" py="lg">
                <Loader />
            </Tabs.Panel>
        )
    }

    const projects = user.projects.filter((project) =>
        Object.values(project.users)
            .map((role) => role.users.includes(user._id))
            .includes(true)
    );

    return (
        <Tabs.Panel value="membered" px="sm" py="lg">
            <ScrollArea type="never" scrollbars="y">
                {projects.length > 0 ? (
                    <Grid align="stretch">
                        {projects.map((project) => (
                            <Grid.Col
                                span={{ base: 12, md: 6, lg: 4 }}
                                key={project._id}
                            >
                                <ProjectCard project={project} />
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Alert
                        variant="light"
                        color="#5c8593"
                        title="Looks like you aren't a member of any projects."
                        icon={<IoMdInformationCircleOutline />}
                    >
                        Looking for your next big project? Head over to our{' '}
                        <Link to="/projects">Browse Projects</Link> to see what
                        other people are working on.
                    </Alert>
                )}
            </ScrollArea>
        </Tabs.Panel>
    );
}

export function SharedProjectsPanel({ uid }: { uid: string }) {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Loader />
    }

    const projects = user.projects.filter((project) =>
        Object.values(project.users)
            .map((role) => role.users.includes(uid))
            .includes(true) || project.owner === uid
    );

    return (
        <ScrollArea type="never" scrollbars="y">
            {projects.length > 0 ? (
                <Grid align="stretch">
                    {projects.map((project) => (
                        <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={project._id}
                        >
                            <ProjectCard project={project} />
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="Looks like you don't share any projects with this person."
                    icon={<IoMdInformationCircleOutline />}
                >
                    Try reaching out to see if they want to invite you to one of their projects, or start a new one together!
                </Alert>
            )}
        </ScrollArea>
    );
}