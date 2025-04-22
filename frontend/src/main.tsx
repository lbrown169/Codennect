import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import { LoggedInUser } from './types/User.ts';
import { LoadData, UserContext } from './hooks/UserContext.ts';
import LogoutPage from './pages/LogoutPage.tsx';
import { getVersion, isProd } from './utils.ts';

function Wrapper() {
    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(true);

    if (isProd()) {
        console.info('[PRODUCTION] Codennect Web');
        console.info('Version: ' + getVersion());
    } else {
        console.info('[DEVELOPMENT] Codennect Web');
        console.info('Version: ' + getVersion());
    }

    useEffect(() => {
        LoadData(setUser, setVerified).then(() => setLoaded(true));
    }, []);

    return (
        <MantineProvider>
            <UserContext.Provider
                value={{ user, setUser, loaded, verified, setVerified }}
            >
                <Notifications />
                <Router>
                    <Routes>
                        <Route
                            path="/login"
                            element={<LoginPage mode={'login'} />}
                        />
                        <Route
                            path="/register"
                            element={<LoginPage mode={'register'} />}
                        />
                        <Route
                            path="/verify"
                            element={<LoginPage mode={'verify'} />}
                        />
                        <Route
                            path="/verify-expired"
                            element={<LoginPage mode={'failed-verify'} />}
                        />
                        <Route
                            path="/verified"
                            element={<LoginPage mode={'verified'} />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<LoginPage mode={'forgot'} />}
                        />
                        <Route
                            path="/change-password"
                            element={<LoginPage mode={'change'} />}
                        />
                        <Route path="/logout" element={<LogoutPage />} />
                        <Route path="*" element={<App />} />
                    </Routes>
                </Router>
            </UserContext.Provider>
        </MantineProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Wrapper />
    </StrictMode>
);
