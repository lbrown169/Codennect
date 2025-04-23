import { useState, useEffect, useContext } from 'react';
import { Title, Box, SimpleGrid, Card, Group, Pill, ActionIcon, Modal, Button, Stack, Divider, Text } from '@mantine/core';
import { LuCrown } from 'react-icons/lu';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

// Inline type definitions (remove these if you have them in separate files)
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
    isOwner?: boolean;
}

// Inline getUserInfo function (replace with real implementation if available)
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

    // State for projects, users, loading, and errors
    const [projectsWithUsers, setProjectsWithUsers] = useState<{ project: Project; users: User[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the confirmation dialog
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Fetch all projects the user is a part of and their users
    useEffect(() => {
        async function fetchProjectsAndUsers() {
            try {
                if (!user) {
                    setError('No user data available');
                    return;
                }

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
                    const ownerResponse = await getUserInfo(project.owner);
                    if (ownerResponse.status === 200) {
                        const owner = await ownerResponse.json();
                        const ownerRoles = Object.keys(project.users).filter(role =>
                            project.users[role].users.includes(owner._id)
                        );
                        tempUsers.push({ ...owner, roles: ownerRoles, isOwner: project.owner === user._id });
                    } else {
                        console.warn(`Failed to fetch owner for project ${project._id}: Status ${ownerResponse.status}`);
                    }

                    // Fetch users for each role in this project
                    for (const role in project.users) {
                        for (const userId of project.users[role].users) {
                            if (!tempUsers.find((member) => member._id === userId)) {
                                const userResponse = await getUserInfo(userId);
                                if (userResponse.status === 200) {
                                    const userData = await userResponse.json();
                                    const userRoles = Object.keys(project.users).filter(r =>
                                        project.users[r].users.includes(userData._id)
                                    );
                                    tempUsers.push({ ...userData, roles: userRoles, isOwner: project.owner === user._id });
                                } else {
                                    console.warn(`Failed to fetch user ${userId} for project ${project._id}: Status ${userResponse.status}`);
                                }
                            }
                        }
                    }

                    projectsData.push({ project, users: tempUsers });
                }

                setProjectsWithUsers(projectsData);
            } catch (err) {
                console.error('Error fetching projects and users:', err);
                setError('Failed to load team details. Please try again later.');
            } finally {
                setLoading(false); // Always set loading to false, even if an error occurs
            }
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

    if (error) {
        return (
            <Box mx={{ base: 'md', lg: 'xl' }}>
                <Title py="md" order={1}>
                    My Teams
                </Title>
                <div className="accountBox">
                    <h1>Error</h1>
                    <p>{error}</p>
                </div>
            </Box>
        );
    }

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
                                                {projectData.project.owner === user._id && user.isOwner && (
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
                                                {user.isOwner && (
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
