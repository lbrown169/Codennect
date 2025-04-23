import { Title, Box, Tabs } from '@mantine/core';
import {
    MemberedProjectsPanel,
    OwnedProjectsPanel,
} from '../components/dashboard/ProjectsPanel';

export default function DashboardPage() {
    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                Dashboard
            </Title>
            <Tabs color="#5c8593" defaultValue="owned">
                <Tabs.List>
                    <Tabs.Tab value="owned">Owned Projects</Tabs.Tab>
                    <Tabs.Tab value="membered">All My Projects</Tabs.Tab>
                </Tabs.List>

                <OwnedProjectsPanel />
                <MemberedProjectsPanel />
            </Tabs>
        </Box>
    );
}
