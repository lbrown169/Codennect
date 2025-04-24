import { Paper, Title, Text, Stack, Badge, Group, Divider, RingProgress } from "@mantine/core";
import { User } from "../../types/User";
import { Link } from "react-router-dom";

export default function ProjectHeader({ title, description, skills, fill, owner }: {title: string, description: string, skills: string[], fill: { total: number, open: number}, owner: User | undefined}) {
    return (
        <Paper shadow="md" radius="md" p="xl">
            <Group gap="xl" wrap="nowrap">
                <RingProgress 
                    visibleFrom="lg"
                    size={250}
                    thickness={20}
                    label={
                        <Text size="md" ta="center">
                            {fill.open}/{fill.total} Positions Open
                        </Text>
                    }
                    sections={[
                        { value: fill.open / fill.total * 100, color: '#5b8580'}
                    ]}
                />
                <Divider visibleFrom="lg" orientation="vertical" />
                <Stack className="grow">
                    <Stack gap={0}>
                        <Title order={1}>
                            {title}
                        </Title>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="sm" c="dimmed">
                            Project Description
                        </Text>
                        <Text className="wrap-break-word">{description}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="sm" c="dimmed">
                            Owned by
                        </Text>
                        {owner && (
                            <Link to={`/users/${owner._id}`}>{owner.name}</Link>
                        )}
                    </Stack>
                    <Divider />
                    <Stack gap={5}>
                        <Text size="sm" c="dimmed">
                            Required Skills
                        </Text>
                        <Group gap="xs">
                            {skills.map((skill) => (
                                <Badge color="#5b8580" key={skill}>
                                    {skill}
                                </Badge>
                            ))}
                        </Group>
                    </Stack>
                </Stack>
            </Group>
        </Paper>
    )
}