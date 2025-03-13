import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
function App() {
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
            </Routes>
        </Router>
    );
}
export default App;