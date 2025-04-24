import { Title, Box, Loader, Grid, Card, Text, Group, Badge, Stack, Modal, MultiSelect, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../types/User';
import { getUserInfo } from '../../api/UserAPI';
import { SharedProjectsPanel } from '../../components/dashboard/ProjectsPanel';
import { useDisclosure } from '@mantine/hooks';
import { RiMailAddLine } from "react-icons/ri";
import InviteUserModal from '../../components/InviteUserModal';

export default function UserProfilePage() {
    const { user_id } = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!user_id) return;
            setLoading(true);
            const userResponse = await getUserInfo(user_id);
            if (userResponse.status === 200) {
                setUser((await userResponse.json()).result);
            }
            setLoading(false);
        }

        fetchData();
    }, [user_id]);

    useEffect(() => {
        console.log(user);
    }, [user])

    if (!user_id) return (window.location.href = '/dashboard');

    if (!user || loading) {
        return <Loader />
    }

    return (
        <>
            <InviteUserModal user={user} opened={opened} close={close} />
            <Box mx={{ base: 'md', lg: 'xl' }}>
                <div className="flex justify-between items-center">
                    <Title py="md" order={1}>
                        {user.name}'s Profile
                    </Title>
                    <RiMailAddLine className='cursor-pointer' color='#5c8593' size={30} onClick={open} />
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
                    <Card
                        className="h-full gap-3"
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                    >
                        <Title order={3}>Shared Projects</Title>
                        <SharedProjectsPanel uid={user_id}/>
                    </Card>
                </Stack>
            </Box>
        </>
    );
}
