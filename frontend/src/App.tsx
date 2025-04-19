import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import { getVersion, isProd } from './utils';
import ProjectPage from './pages/ProjectPage';
import UserProfilePage from './pages/UserProfilePage';
import BrowseProjectsPage from './pages/BrowseProjectsPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { MantineProvider } from '@mantine/core';

function App() {

    if (isProd()) {
        console.info("[PRODUCTION] Codennect Web")
        console.info("Version: " + getVersion())
    } else {
        console.info("[DEVELOPMENT] Codennect Web")
        console.info("Version: " + getVersion())
    }

    /*
    const theme = createTheme({
        :root {
            fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
            line-height: 1.5;
            font-weight: 400;
          
            color-scheme: light dark;
            color: rgba(255, 255, 255, 0.87);
            background: linear-gradient(#adc2af, #5c8593);
          
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
    });
    */

    return <MantineProvider>{
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<VerifyEmailPage />} />
                <Route path="/verify-email" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/userprofile" element={<UserProfilePage />} />
                <Route path="/browse" element={<BrowseProjectsPage />} />
                <Route path="/projects/:project_id" element={<ProjectPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/projects/:project_id" element={<ProjectPage />} />
            </Routes>
        </Router>    
    }</MantineProvider>

}

export default App;
