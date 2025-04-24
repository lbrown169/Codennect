import { Alert, Badge, Card, Grid, Group, RingProgress, Stack, Tabs, Text } from "@mantine/core";
import { ProjectUsers } from "../../types/Project";
import { User } from "../../types/User";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

export function MembersTabPanel({ members, cache }: { members: ProjectUsers, cache: User[]}) {
    const formatted: {[id: string]: string[]} = {};

    for (const role in members) {
        for (const user of members[role].users) {
            if (!formatted[user]) {
                formatted[user] = [role];
            } else {
                formatted[user].push(role);
            }
        }
    }

    return (
        <Tabs.Panel value="members" px="sm" py="lg">
                <Stack>
                    <Text size="sm" c="dimmed">
                        Roles
                    </Text>
                    <Grid grow>
                        {Object.keys(members).map(role => (
                            <Grid.Col
                                span={{ base: 12, md: 4, xl: 2 }}
                                key={role}
                            >
                                <Card
                                    className="h-full gap-3"
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Group>
                                        <RingProgress 
                                            size={75}
                                            thickness={8}
                                            sections={[
                                                { value: (members[role].users.length) / members[role].max * 100, color: '#5b8580'}
                                            ]}
                                        />
                                        <Stack justify="flex-start" gap={0}>
                                            <p className="uppercase text-xs font-bold text-[#5c8593] pb-1">
                                                {role}
                                            </p>
                                            <Text size="sm" c="dimmed">
                                                {Math.max(0, members[role].max - members[role].users.length)} positions open
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                    {Object.keys(formatted).length > 0 ? (
                        <>
                            <Text size="sm" c="dimmed">
                                Members
                            </Text>
                            <Grid grow>
                                {Object.keys(formatted).map((uid) => (
                                    <Grid.Col
                                        span={{ base: 12, md: 6, lg: 3 }}
                                        key={uid}
                                    >
                                        <Card
                                            className="h-full gap-3"
                                            shadow="sm"
                                            padding="lg"
                                            radius="md"
                                            withBorder
                                        >
                                            <Link to={`/users/${uid}`}>
                                                <Text fw={500}>{cache.find(u => u._id === uid)?.name}</Text>
                                            </Link>
                                            <Text size="sm" c="dimmed">
                                                Roles
                                            </Text>
                                            <Group>
                                                {formatted[uid].map((role) => (
                                                    <Badge color="#5b8580" key={role}>
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <Alert
                            variant="light"
                            color="#5c8593"
                            title="This project has no members."
                            icon={<IoMdInformationCircleOutline />}
                        >
                            Why don't you be the first one?
                        </Alert>
                    )}
                </Stack>
            
        </Tabs.Panel>
    );
}