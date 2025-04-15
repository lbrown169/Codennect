import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { getVersion, isProd } from './utils';
import UserProfilePage from './pages/UserProfilePage';
import BrowseProjectsPage from './pages/BrowseProjectsPage';

import ProjectPage from './pages/ProjectPage';
function App() {

    if (isProd()) {
        console.info("[PRODUCTION] Codennect Web")
        console.info("Version: " + getVersion())
    } else {
        console.info("[DEVELOPMENT] Codennect Web")
        console.info("Version: " + getVersion())
    }

    return (
        <Router >
            <Routes>
                <Route path="/" element={<LoginPage />}>
                </Route>
                <Route path="/login" element={<LoginPage />}>
                </Route>
                <Route path="/register" element={<SignupPage />}>
                </Route>
                <Route path="/dashboard" element={<DashboardPage />}>
                </Route>
                <Route path="/userprofile" element={<UserProfilePage />}>
                </Route>
                <Route path="/browse" element={<BrowseProjectsPage />}>
                </Route>
                <Route path="/projects/:project_id" element={<ProjectPage />}>
                </Route>
            </Routes>
        </Router>
    );
}
export default App;