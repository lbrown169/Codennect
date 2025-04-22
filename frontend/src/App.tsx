import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppShell, Burger, Group, Image } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import DashboardPage from './pages/DashboardPage';

import ProjectPage from './pages/projects/ProjectPage';
import MyProfilePage from './pages/users/MyProfilePage';
import BrowseProjectsPage from './pages/projects/BrowseProjectsPage';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from './components/Navbar';
import { useContext, useEffect } from 'react';
import { UserContext } from './hooks/UserContext';
import UserProfilePage from './pages/users/UserProfilePage';
import BrowseUsersPage from './pages/users/BrowseUsersPage';
import TeamUsersPage from './pages/users/TeamUsersPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    const [opened, { toggle }] = useDisclosure();
    const { user, loaded, verified } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loaded) {
            if (!verified) {
                navigate('/verify');
            } else if (!user) {
                navigate('/login');
            }
        }
    }, [user, loaded]);

    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 200, md: 300, lg: 350 },
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Image
                        className="h-13 lg:h-15 xl:h-17"
                        src="/banner.png"
                        alt="Logo"
                    />
                </Group>
            </AppShell.Header>
            <Navbar />
            <AppShell.Main>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/users" element={<BrowseUsersPage />} />
                    <Route path="/users/me" element={<MyProfilePage />} />
                    <Route path="/users/related" element={<TeamUsersPage />} />
                    <Route path="/users/:id" element={<UserProfilePage />} />
                    <Route path="/projects" element={<BrowseProjectsPage />} />
                    <Route
                        path="/projects/create"
                        element={<CreateProjectPage />}
                    />
                    <Route
                        path="/projects/:project_id"
                        element={<ProjectPage />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}

export default App;
