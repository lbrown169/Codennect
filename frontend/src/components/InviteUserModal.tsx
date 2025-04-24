import { useForm } from "@mantine/form";
import { User } from "../types/User";
import { Button, Loader, Modal, MultiSelect, Select, Stack, Textarea } from "@mantine/core";
import { useContext } from "react";
import { UserContext } from "../hooks/UserContext";
import { createRequest } from "../api/RequestsAPI";
import { notifications } from "@mantine/notifications";

export default function InviteUserModal({ user, opened, close }: { user: User, opened: boolean, close: () => void }) {
    const { user: loggedIn } = useContext(UserContext);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            roles: user.roles,
            message: "",
            project: "",
        }
    })

    const roleOptions = [
        'Project Manager',
        'Frontend',
        'Backend',
        'Database',
        'Mobile',
    ];

    if (!loggedIn) {
        return <Loader />
    }

    const projects = loggedIn.projects.filter(p => p.owner === loggedIn._id).map(p => ({ value: p._id, label: p.name }));

    async function createWrapper({ project, message, roles }: { project: string, message: string, roles: string[]}) {
        try {
            if (!user) return;
            await createRequest(project, user._id, "invite", roles, message);
            notifications.show({
                title: 'Invite Successful',
                message: 'The user has received an invite to the project you specified',
                color: 'green',
            });
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to log you in, please try again later.',
                color: 'red',
            });
        }
    }

    return (
        <Modal opened={opened} onClose={close} title="Invite to Project">
            <form onSubmit={form.onSubmit(values => createWrapper(values))}>
                <Stack>
                    <Select
                        label="What project would you like to add them to?"
                        placeholder="Choose project"
                        data={projects}
                        key={form.key('project')}
                        {...form.getInputProps('project')}
                        required
                    />
                    <MultiSelect
                        label="What roles do you want to give?"
                        placeholder="Choose roles"
                        data={roleOptions}
                        key={form.key('roles')}
                        {...form.getInputProps('roles')}
                        required
                    />
                    <Textarea
                        label="What message would you like to include in your invite?"
                        resize="both"
                        key={form.key('message')}
                        {...form.getInputProps('message')}
                        required
                        rows={4}
                    />
                    <Button type="submit" color="#5c8593">Invite</Button>
                </Stack>
            </form>
        </Modal>
    )
}