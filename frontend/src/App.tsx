import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
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
                <Route path="/register" element={<VerifyEmailPage />}>
                </Route>
                <Route path="/dashboard" element={<DashboardPage />}>
                </Route>
                <Route path="verify-email" element={<SignupPage />}>
                </Route>
            </Routes>
        </Router>
    );
}
export default App;