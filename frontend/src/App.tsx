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

import { getVersion, isProd } from './utils';
import UserProfilePage from './pages/UserProfilePage';

function App() {

    if (isProd()) {
        console.info("[PRODUCTION] Codennect Web")
        console.info("Version: " + getVersion())
    } else {
        console.info("[DEVELOPMENT] Codennect Web")
        console.info("Version: " + getVersion())
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/userprofile" element={<UserProfilePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/projects/:project_id" element={<ProjectPage />} />
            </Routes>
        </Router>
    );
}

export default App;
