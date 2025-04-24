import { Alert, Button, Card, Grid, Group, Modal, MultiSelect, NumberInput, Stack, Tabs, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Project, ProjectUsers } from "../../types/Project";
import { removeUserFromProject, updateProject } from "../../api/ProjectAPI";
import { notifications } from "@mantine/notifications";
import { User } from "../../types/User";
import { useContext } from "react";
import { UserContext } from "../../hooks/UserContext";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { approveRequest, denyRequest } from "../../api/RequestsAPI";
import { CgProfile } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

export function OwnerTab({ project, setRefresh, cache }: { project: Project, setRefresh: React.Dispatch<React.SetStateAction<string>>, cache: User[] }) {
    const { requests } = useContext(UserContext);
    const [detailsOpened, { open: openDetails , close: closeDetails }] = useDisclosure(false);
    const [usersOpened, { open: openUsers, close: closeUsers }] = useDisclosure(false);
    const [applicationsOpened, { open: openApplications, close: closeApplications }] = useDisclosure(false);
    // const [fieldsOpened, { open: openFields, close: closeFields }] = useDisclosure(false);

    const detailsForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: project.name,
            description: project.description,
            required_skills: project.required_skills
        }
    })

    const rolesIV: {[role: string]: number} = {}
    for (const role of Object.keys(project.users)) {
        rolesIV[role] = project.users[role].max;
    }

    const rolesForm = useForm({
        mode: 'uncontrolled',
        initialValues: rolesIV
    })

    async function onDetailsSubmit(updates: { name: string, description: string, required_skills: string[] }) {
        closeDetails();
        try {
            await updateProject(project._id, updates);
            setRefresh(Math.random().toString())
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to update the project, please try again later.',
                color: 'red',
            });
        }
    }

    async function removeFromProject(uid: string) {
        try {
            await removeUserFromProject(project._id, uid);
            setRefresh(Math.random().toString())
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to remove the user, please try again later.',
                color: 'red',
            });
        }
    }

    async function onRolesSubmit(passed: { [role: string]: number }) {
        closeDetails();
        
        const updates: ProjectUsers = {}
        for (const role of Object.keys(project.users)) {
            updates[role] = project.users[role];
            updates[role].max = passed[role];
        }

        try {
            await updateProject(project._id, { users: updates });
            setRefresh(Math.random().toString())
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to update the roles, please try again later.',
                color: 'red',
            });
        }
    }

    async function onRequestChange(uid: string, requestType: string, responseType: string) {
        closeApplications();
        try {
            if (responseType === "deny") {
                await denyRequest(project._id, uid, requestType);
                notifications.show({
                    title: 'Request Denied',
                    message: 'The request has successfully been denied.',
                    color: 'green',
                });
            } else {
                await approveRequest(project._id, uid, requestType);
                notifications.show({
                    title: 'Request Approved',
                    message: 'The request has successfully been approved.',
                    color: 'green',
                });
            }
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to respond to the request, please try again later.',
                color: 'red',
            });
        }
    }

    const skillOptions = [
        'Android (Kotlin/Java)',
        'Angular',
        'Arduino',
        'AWS',
        'C#',
        'C++',
        'Dart',
        'Docker',
        'Express.js',
        'Figma (UI/UX)',
        'Firebase',
        'Flutter',
        'Google Cloud',
        'GraphQL',
        'iOS (Swift)',
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

    return (
        <>
            <Modal opened={detailsOpened} onClose={closeDetails} title="Update Project Details">
                <form onSubmit={detailsForm.onSubmit(values => onDetailsSubmit(values))}>
                    <Stack>
                        <TextInput
                            label="Update Project Name"
                            key={detailsForm.key('name')}
                            {...detailsForm.getInputProps('name')}
                            required
                        />
                        <Textarea
                            label="Update Project Description"
                            resize="both"
                            key={detailsForm.key('description')}
                            {...detailsForm.getInputProps('description')}
                            required
                            rows={4}
                        />
                        <MultiSelect 
                            radius = "md"
                            label="Update Project Skills"
                            data={skillOptions}
                            key={detailsForm.key('required_skills')}
                            {...detailsForm.getInputProps('required_skills')}
                            searchable
                        />
                        <Button type="submit" color="#5c8593">Update Project</Button>
                    </Stack>
                </form>
            </Modal>

            <Modal opened={usersOpened} onClose={closeUsers} title="Update Users and Roles">
                <form onSubmit={rolesForm.onSubmit(values => onRolesSubmit(values))}>
                    <Stack>
                        {Object.keys(project.users).map(role => (
                            <Stack>
                                <Group grow justify="between">
                                    <Text>{role}</Text>
                                    <NumberInput
                                        allowDecimal={false}
                                        min={0}
                                        key={rolesForm.key(role)}
                                        {...rolesForm.getInputProps(role)}
                                        hideControls
                                    />
                                </Group>
                                <Stack gap="xs">
                                    {project.users[role].users.map(uid => (
                                        <div className="flex justify-between bg-slate-100 py-2 px-3 rounded-sm">
                                            <Group>
                                                <CgProfile />
                                                <Text size="sm">{cache.find(u => u._id === uid)?.name}</Text>
                                            </Group>
                                            {/* <Button variant="outline" color="red" onClick={(_) => removeFromProject(uid)}>Remove</Button>
                                             */}
                                            <FaRegTrashAlt className="cursor-pointer" color="red" onClick={(_) => removeFromProject(uid)} />
                                        </div>
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
                        <Button type="submit" color="#5c8593">Update Role Settings</Button>
                    </Stack>
                </form>
            </Modal>

            <Modal opened={applicationsOpened} onClose={closeApplications} title="Update Requests">
                <Stack>
                    <Stack>
                        <Title order={3}>Invites</Title>
                        {requests && requests.invites[project._id] && requests.invites[project._id].length > 0 ? (
                            <Stack>
                                {requests?.invites[project._id].map(invite => (
                                    <Stack className="bg-slate-100" gap={5} p="sm">
                                        <Text><Link to={`/users/${invite.user_id}`}>{cache.find(u => u._id === invite.user_id)?.name}</Link></Text>
                                        <Text c="dimmed">{invite.roles.join(", ")}</Text>
                                        <Text>{invite.message}</Text>
                                        <Group grow>
                                            <Button color="red" onClick={() => onRequestChange(invite.user_id, "invite", "deny")}>Deny</Button>
                                        </Group>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                            <Alert
                                variant="light"
                                color="#5c8593"
                                title="No Existing Invites"
                                icon={<IoMdInformationCircleOutline />}
                            >
                                You haven't invited anyone to join the project.
                            </Alert>
                        )}
                    </Stack>
                    <Stack>
                        <Title order={3}>Applications</Title>
                        {requests && requests.applications[project._id] && requests.applications[project._id].length > 0 ? (
                            <Stack>
                                {requests?.applications[project._id].map(application => (
                                    <Stack className="bg-slate-100" gap={5} p="sm">
                                        <Text><Link to={`/users/${application.user_id}`}>{cache.find(u => u._id === application.user_id)?.name}</Link></Text>
                                        <Text c="dimmed">{application.roles.join(", ")}</Text>
                                        <Text>{application.message}</Text>
                                        <Group grow>
                                            <Button color="#5c8593" onClick={() => onRequestChange(application.user_id, "application", "approve")}>Approve</Button>
                                            <Button color="red" onClick={() => onRequestChange(application.user_id, "application", "deny")}>Deny</Button>
                                        </Group>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                            <Alert
                                variant="light"
                                color="#5c8593"
                                title="No Existing Applications"
                                icon={<IoMdInformationCircleOutline />}
                            >
                                No one has applied to be a part of this project
                            </Alert>
                        )}
                    </Stack>
                </Stack>
            </Modal>

            <Tabs.Panel value="owner" px="sm" py="lg">
                <Grid grow>
                    <Grid.Col
                        span={{ base: 12, sm: 6, lg: 3 }}
                    >
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Stack className="grow">
                                <Title order={3}>
                                    Update Project Details
                                </Title>
                                <Text className="grow">Update the name of your project, project description, or required skills.</Text>
                                <Button onClick={openDetails} color="#5c8593">Edit</Button>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, sm: 6, lg: 3 }}
                    >
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Stack className="grow">
                                <Title order={3}>
                                    Update Users and Roles
                                </Title>
                                <Text className="grow">Update the how many positions of each role are open, and remove members from your project.</Text>
                                <Button onClick={openUsers} color="#5c8593">Edit</Button>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, sm: 6, lg: 3 }}
                    >
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Stack className="grow">
                                <Title order={3}>
                                    Update Requests
                                </Title>
                                <Text className="grow">View sent out invites and incoming applications, and approve or deny them.</Text>
                                <Button onClick={openApplications} color="#5c8593">Edit</Button>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    {/* <Grid.Col
                        span={{ base: 12, sm: 6, lg: 3 }}
                    >
                        <Card
                            className="h-full gap-3"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Stack className="grow">
                                <Title order={3}>
                                    Update Project Fields
                                </Title>
                                <Text className="grow">Update the custom fields that apply to your project.</Text>
                                <Button onClick={openFields} color="#5c8593">Edit</Button>
                            </Stack>
                        </Card>
                    </Grid.Col> */}
                </Grid>
            </Tabs.Panel>
        </>
    );
}