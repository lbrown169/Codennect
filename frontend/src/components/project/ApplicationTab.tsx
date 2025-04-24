import { Alert, Button, MultiSelect, Stack, Tabs, Textarea } from "@mantine/core";
import { useContext, useState } from "react";
import { LoadData, UserContext } from "../../hooks/UserContext";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useForm } from "@mantine/form";
import { createRequest } from "../../api/RequestsAPI";
import { notifications } from "@mantine/notifications";

export function ApplicationTab({ pid }: { pid: string }) {
    const { user, requests, setUser, setVerified, setRequests } = useContext(UserContext);
    const [submitted, setSubmitted] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            roles: [],
            message: ""
        }
    })
    
    const existing = requests?.applications.me.find(app => app.project_id === pid );

    if (submitted) {
        return (
            <Tabs.Panel value="application" px="sm" py="lg">
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="Application Submitted!"
                    icon={<IoMdInformationCircleOutline />}
                >
                    Your application has successfully been submitted. You will receive an update via email when the Project Owner makes a decision.
                </Alert>
            </Tabs.Panel>
        );
    }

    if (existing) {
        return (
            <Tabs.Panel value="application" px="sm" py="lg">
                <Alert
                    variant="light"
                    color="yellow"
                    title="Active Application"
                    icon={<IoMdInformationCircleOutline />}
                >
                    You have an active aplication for this project. Please wait for the Project Owner to respond to your previous application before making a new one.<br />
                    Roles: {existing.roles.join(", ")}
                </Alert>
            </Tabs.Panel>
        );
    }

    const roleOptions = [
        'Project Manager',
        'Frontend',
        'Backend',
        'Database',
        'Mobile',
    ];

    async function createWrapper({ message, roles }: { message: string, roles: string[]}) {
        try {
            if (!user) return;
            await createRequest(pid, user._id, "application", roles, message);
            await LoadData(setUser, setVerified, setRequests);
            setSubmitted(true);
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
        <Tabs.Panel value="application" px="sm" py="lg">
            <form onSubmit={form.onSubmit((values) => createWrapper(values))}>
                <Stack align="flex-start">
                    <MultiSelect
                        label="What roles would you like to apply for?"
                        placeholder="Choose roles"
                        data={roleOptions}
                        key={form.key('roles')}
                        {...form.getInputProps('roles')}
                        required
                    />
                    <Textarea
                        label="What message would you like to include in your application?"
                        resize="both"
                        key={form.key('message')}
                        {...form.getInputProps('message')}
                        required
                        rows={4}
                    />
                    <Button type="submit" color="#5c8593">Submit Application</Button>
                </Stack>
            </form>
        </Tabs.Panel>
    );
}