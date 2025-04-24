import { Button, Modal, MultiSelect, Stack, TextInput } from "@mantine/core";
import { LoggedInUser } from "../types/User";
import { useForm } from "@mantine/form";
import { patchRequest } from "../api/utils";
import { LoadData, UserContext } from "../hooks/UserContext";
import { useContext } from "react";
import { notifications } from "@mantine/notifications";

export default function EditProfileModal({ user, opened, close }: { user: LoggedInUser, opened: boolean, close: () => void }) {
    const { setUser, setVerified, setRequests } = useContext(UserContext);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: user.name,
            roles: user.roles,
            skills: user.skills,
            comm: user.comm
        }
    })

    const roleOptions = [
        'Project Manager',
        'Frontend',
        'Backend',
        'Database',
        'Mobile',
    ];
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

    async function updateWrapper(values: { name: string, roles: string[], skills: string[], comm: string}) {
        close()
        try {
            if (!user) return;
            await patchRequest("/api/users/me", {
                body: { updates: values }
            });
            await LoadData(setUser, setVerified, setRequests);
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to update your profile, please try again later.',
                color: 'red',
            });
        }
        }

    return (
        <Modal opened={opened} onClose={close} title="Edit User Profile">
            <form onSubmit={form.onSubmit(values => updateWrapper(values))}>
                <Stack>
                    <TextInput
                        label="Name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                        required
                    />
                    <TextInput
                        label="Preferred commiunication method"
                        key={form.key('comm')}
                        {...form.getInputProps('comm')}
                        required
                    />
                    <MultiSelect
                        label="What roles fit you the most?"
                        placeholder="Choose roles"
                        data={roleOptions}
                        key={form.key('roles')}
                        {...form.getInputProps('roles')}
                        required
                    />
                    <MultiSelect
                        label="What skills fit you the most?"
                        placeholder="Choose skills"
                        data={skillOptions}
                        key={form.key('skills')}
                        {...form.getInputProps('skills')}
                        searchable
                        required
                    />
                    <Button type="submit" color="#5c8593">Update Profile</Button>
                </Stack>
            </form>
        </Modal>
    )
}