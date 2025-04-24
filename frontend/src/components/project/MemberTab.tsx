import { Button, Modal, Stack, Tabs, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Project } from "../../types/Project";
import { removeUserFromProject } from "../../api/ProjectAPI";
import { notifications } from "@mantine/notifications";
import { useContext } from "react";
import { UserContext } from "../../hooks/UserContext";

export function MemberTab({ project, setRefresh }: { project: Project, setRefresh: React.Dispatch<React.SetStateAction<string>> }) {
    const { user } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);

    async function removeFromProject() {
        if (!user) return;
        try {
            await removeUserFromProject(project._id, user._id);
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

    return (
        <>
            <Modal opened={opened} onClose={close} title="Leave Project">
                <Stack>
                    <Text>Are you sure you want to leave this project?</Text>
                    <Button onClick={() => removeFromProject()} color="red">Yes, leave project</Button>
                </Stack>
            </Modal>

            <Tabs.Panel value="member" px="sm" py="lg">
                <Stack className="grow">
                    <Title order={3}>
                        Leave Project
                    </Title>
                    <Text className="grow">Update the name of your project, project description, or required skills.</Text>
                    <Button onClick={open} color="red">Leave Project</Button>
                </Stack>
            </Tabs.Panel>
        </>
    );
}