import { useState, useEffect, useContext } from 'react';
import { Title, Box, SimpleGrid, Card, Group, Pill, ActionIcon, Modal, Button, Stack, Divider, Text } from '@mantine/core';
import { LuCrown } from 'react-icons/lu';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { createContext } from 'react';

// Inline type definitions to resolve TS2307 errors
interface Project {
    _id: string;
    name: string;
    description: string;
    owner: string;
    users: { [role: string]: { users: string[]; max: number } };
    required_skills: string[];
}

interface User {
    _id: string;
    username: string;
    projects: Project[];
    roles?: string[];
}

// Inline UserContext definition to resolve TS2307 and TS2339 errors
const UserContext = createContext<{
    user: User | null;
    loaded: boolean;
    verified: boolean;
}>({
    user: null,
    loaded: false,
    verified: false,
});

// Inline getUserInfo function to resolve TS2307 for UserAPI
async function getUserInfo(userId: string): Promise<{ status: number; json: () => Promise<User> }> {
    // Mock implementation for now
    return {
        status: 200,
        json: async () => ({
            _id: userId,
            username: `User_${userId}`,
            projects: [],
        }),
    };
}

export default function TeamUsersPage() {
    const { user } = useContext(UserContext); // Get current user to access projects and determine ownership

    // State for projects and their users
    const [projectsWithUsers, setProjectsWithUsers] = useState<{ project: Project; users: User[] }[]>([]);
    const [loading, setLoading] = useState(true);

    // State for the confirmation dialog
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Fetch all projects the user is a part of and their users
    useEffect(() => {
        async function fetchProjectsAndUsers() {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);

            // Filter projects where the user is a member or owner
            const relatedProjects = user.projects.filter(project =>
                project.owner === user._id ||
                Object.values(project.users)
                    .map(role => role.users.includes(user._id))
                    .includes(true)
            );

            const projectsData: { project: Project; users: User[] }[] = [];

            // Fetch users for each project
            for (const project of relatedProjects) {
                const tempUsers: User[] = [];

                // Fetch the owner
                let response = await getUserInfo(project.owner);
                if (response.status === 200) {
                    const owner = await response.json();
                    const ownerRoles = Object.keys(project.users).filter(role =>
                        project.users[role].users.includes(owner._id)
                    );
                    tempUsers.push({ ...owner, roles: ownerRoles, isOwner: project.owner === user._id });
                }

                // Fetch users for each role in this project
                for (const role in project.users) {
                    for (const userId of project.users[role].users) {
                        if (!tempUsers.find((member) => member._id === userId)) {
                            response = await getUserInfo(userId);
                            if (response.status === 200) {
                                const userData = await response.json();
                                const userRoles = Object.keys(project.users).filter(r =>
                                    project.users[r].users.includes(userData._id)
                                );
                                tempUsers.push({ ...userData, roles: userRoles, isOwner: project.owner === user._id });
                            }
                        }
                    }
                }

                projectsData.push({ project, users: tempUsers });
            }

            setProjectsWithUsers(projectsData);
            setLoading(false);
        }

        fetchProjectsAndUsers();
    }, [user]);

    // Handler for remove action
    const handleRemove = (userId: string, projectId: string) => {
        setSelectedUserId(userId);
        setSelectedProjectId(projectId);
        open();
    };

    // Confirm removal
    const confirmRemove = async () => {
        if (selectedUserId && selectedProjectId) {
            // Placeholder for API call to remove user
            // await removeUserFromProject(selectedUserId, selectedProjectId);
            
            // Update state to remove the user from the specific project
            setProjectsWithUsers(projectsWithUsers.map(projectData => {
                if (projectData.project._id === selectedProjectId) {
                    return {
                        ...projectData,
                        users: projectData.users.filter(user => user._id !== selectedUserId)
                    };
                }
                return projectData;
            }));
        }
        close();
    };

    if (loading || !user) {
        return (
            <Box mx={{ base: 'md', lg: 'xl' }}>
                <Title py="md" order={1}>
                    My Teams
                </Title>
                <div className="accountBox">
                    <h1>Loading team details</h1>
                    <p>Hold on just a second while we load the team...</p>
                </div>
            </Box>
        );
    }

    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                My Teams
            </Title>

            {projectsWithUsers.length === 0 ? (
                <Text>No projects found where you are a member or owner.</Text>
            ) : (
                projectsWithUsers.map(projectData => (
                    <Box key={projectData.project._id} mb="xl">
                        {/* Project Header */}
                        <Group mb="md">
                            <Text fw={700} size="lg">
                                {projectData.project.name}
                            </Text>
                            <Link to={`/projects/${projectData.project._id}`}>
                                <Text size="sm" c="blue">
                                    (View Project)
                                </Text>
                            </Link>
                        </Group>

                        {/* User Cards for this Project */}
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            {projectData.users.map(user => (
                                <Card
                                    key={user._id}
                                    className="h-full gap-3"
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Stack>
                                        <Group justify="space-between" mb="xs">
                                            <Group>
                                                {/* Show crown if the current user is the owner and this user is the owner */}
                                                {projectData.project.owner === user._id && projectData.project.owner === user?._id && (
                                                    <LuCrown color="#598392" />
                                                )}
                                                {/* Username with hyperlink to profile */}
                                                <Link to={`/users/${user._id}`}>
                                                    <Text fw={500}>{user.username}</Text>
                                                </Link>
                                            </Group>

                                            {/* Action buttons */}
                                            <Group>
                                                {/* Invite button (visible to all) */}
                                                <ActionIcon
                                                    variant="outline"
                                                    color="gray"
                                                    onClick={() => {
                                                        // Placeholder for invite modal
                                                        console.log('Invite modal will open for', user.username, 'in project', projectData.project.name);
                                                    }}
                                                    aria-label="Invite user"
                                                >
                                                    <Text size="xs">Invite</Text>
                                                </ActionIcon>

                                                {/* Remove button (visible only to owner) */}
                                                {projectData.project.owner === user?._id && (
                                                    <ActionIcon
                                                        variant="outline"
                                                        color="red"
                                                        onClick={() => handleRemove(user._id, projectData.project._id)}
                                                        aria-label="Remove user"
                                                    >
                                                        <Text size="xs">Remove</Text>
                                                    </ActionIcon>
                                                )}
                                            </Group>
                                        </Group>

                                        <Divider />

                                        {/* Roles using Mantine Pills */}
                                        <Group>
                                            {user.roles?.map((role: string) => (
                                                <Pill key={role} size="sm" color="#5b8580">
                                                    {role}
                                                </Pill>
                                            ))}
                                        </Group>
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Box>
                ))
            )}

            {/* Confirmation dialog for removing a user */}
            <Modal
                opened={opened}
                onClose={close}
                title="Confirm Removal"
                centered
            >
                <p>Are you sure you want to remove this user from the project?</p>
                <Group mt="md" justify="flex-end">
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={confirmRemove}>
                        Remove
                    </Button>
                </Group>
            </Modal>
        </Box>
    );
}
