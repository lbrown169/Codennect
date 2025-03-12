import { BrowserRouter as Router, Routes, Route, Redirect, Navigate, Switch } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
function App() {
    return (
        <Router >
            <Routes>
                <Route path="/" exact element={<LoginPage />}>
                </Route>
                <Route path="/login" exact element={<LoginPage />}>
                </Route>
                <Route path="/register" exact element={<SignupPage />}>
                </Route>
                <Route path="/dashboard" element={<DashboardPage />}>
                </Route>
            </Routes>
        </Router>
    );
}
export default App;