import { Title, Box, Card, Stack, TextInput, Textarea, MultiSelect, Text, Grid, NumberInput, Button, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ProjectUsers } from '../../types/Project';
import { useState } from 'react';
import { postRequest } from '../../api/utils';
import { IoMdInformationCircleOutline } from 'react-icons/io';

export default function CreateProjectPage() {
    const roleOptions = [
        'Project Manager',
        'Frontend',
        'Backend',
        'Database',
        'Mobile',
    ];

    const roleIVs: {users: {[role: string]: number}} = {"users": {}};
    for (const role of roleOptions) {
        roleIVs.users[role] = 1;
    }

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            ...roleIVs,
            name: "",
            description: "",
            required_skills: []
        }
    })
    const [submitted, setSubmitted] = useState(false);

    const skillOptions = [
        'Android(Kotlin/Java)',
        'Angular',
        'Arduino',
        'AWS',
        'C#',
        'C++',
        'Dart',
        'Docker',
        'Express.js',
        'Figma(UI/UX)',
        'Firebase',
        'Flutter',
        'Google Cloud',
        'GraphQL',
        'iOS(Swift)',
        'Java',
        'JavaScript',
        'Machine Learning',
        'MongoDB',
        'MySQL',
        'Node.js',
        'OpenAI API',
        'PostgreSQL',
        'Raspberry Pi',
        'React',
        'React Native',
        'REST API',
        'Swift',
        'TensorFlow',
        'TypeScript',
        'Vue.js',
    ];

    async function onCreation(raw: {description: string, name: string, required_skills: string[], users: {[role: string]: number}}) {
        const fullUsers: ProjectUsers = {}
        Object.keys(raw.users).map(role => {
            fullUsers[role] = { max: raw.users[role], users: []}
        })
        const body = {
            name: raw.name,
            description: raw.description,
            isPrivate: false,
            required_skills: raw.required_skills,
            fields: [],
            users: fullUsers
        }

        try {
            const response = await postRequest("/api/projects", { body: body });
            if (response.status === 200) {
                setSubmitted(true);
            } else {
                console.log(response.status);
                console.log(await response.json());
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (submitted) {
        return (
            <Box mx={{ base: 'md', lg: 'xl' }}>
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="Project created successfully."
                    icon={<IoMdInformationCircleOutline />}
                >
                    You may now go and view your new project.
                </Alert>
            </Box>
        )
    }

    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Stack>
                <Title order={1}>
                    Create Project
                </Title>
                <form onSubmit={form.onSubmit(values => onCreation(values))}>
                    <Stack>
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Text size="sm" c="dimmed">
                                Project Details
                            </Text>
                            <Stack>
                                <TextInput
                                    label="Project Name"
                                    key={form.key('name')}
                                    {...form.getInputProps('name')}
                                    required
                                />
                                <Textarea
                                    label="Project Description"
                                    resize="both"
                                    key={form.key('description')}
                                    {...form.getInputProps('description')}
                                    required
                                    rows={4}
                                />
                                <MultiSelect 
                                    radius = "md"
                                    label="Project Skills"
                                    data={skillOptions}
                                    key={form.key('required_skills')}
                                    {...form.getInputProps('required_skills')}
                                    searchable
                                />
                            </Stack>
                        </Card>
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Text size="sm" c="dimmed">
                                Project Roles
                            </Text>
                            <Grid grow>
                                {roleOptions.map(role => (
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
                                            <Stack>
                                                <p className="uppercase text-xs font-bold text-[#5c8593] pb-1">
                                                    {role}
                                                </p>
                                                <NumberInput
                                                    allowDecimal={false}
                                                    min={0}
                                                    key={form.key("users."+role)}
                                                    {...form.getInputProps("users."+role)}
                                                />
                                            </Stack>
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Card>
                        <Group>
                            <Button type="submit" color="#5c8593">Create Project</Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Box>
    );
}
