import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OtherUserProfilePage from './pages/OtherUserProfilePage';
import { getVersion, isProd } from './utils';

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
                <Route path="/forgot-password" element={<ForgotPasswordPage />}>
                </Route>
                <Route path="/reset-password" element={<ResetPasswordPage />}>
                </Route>
                <Route path="/user/:id" element={<OtherUserProfilePage />}>
                </Route>
            </Routes>
        </Router>
    );
}
export default App;
