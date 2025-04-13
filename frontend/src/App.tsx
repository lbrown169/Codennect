import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
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
            </Routes>
        </Router>
    );
}
export default App;