import { Title, Box, Loader, Stack, Grid, Card, Group, Badge, Text } from '@mantine/core';
import { useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import { MdOutlineEdit } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import EditProfileModal from '../../components/EditProfileModal';

export default function MyProfilePage() {
    const {user} = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);

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
                </Stack>
            </Box>
        </>
    );
}
