import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu: React.FC = () => {
    const [projectView, setProjectView] = useState('overview');

    // Check user data, like UserProfile.tsx
    const userDataString = localStorage.getItem('user_data');
    if (!userDataString) {
        window.location.href = '/';
        return null;
    }

    const userData = JSON.parse(userDataString);
    const userName = userData.name;

    // Toggle project view (placeholder for future functionality)
    const showOverview = () => setProjectView('overview');
    const showDetails = () => setProjectView('details');

    return (
        <div className="menuBox">
            <div className="header">
                <div className="logoPlaceholder">Codennect</div>
                <nav className="navLinks">
                    <Link to="/userprofile" className="navButton">Profile</Link>
                    <div className="navDivider"></div>
                    <Link to="/browse" className="navButton">Browse Projects</Link>
                    <div className="navDivider"></div>
                    <Link to="/login" className="navButton">Log Out</Link>
                </nav>
            </div>
            <div className="contentBox">
                <div className="left-side">
                    <h1 className="welcomeText">Welcome, {userName}!</h1>
                    <button
                        type="button"
                        className={`menuButton ${projectView === 'overview' ? 'active' : ''}`}
                        onClick={showOverview}
                    >
                        Project Overview
                    </button>
                    <button
                        type="button"
                        className={`menuButton ${projectView === 'details' ? 'active' : ''}`}
                        onClick={showDetails}
                    >
                        Project Details
                    </button>
                </div>
                <div className="right-side">
                    <div className="dashboardBox">
                        <h2 className="dashboardTitle">Your Current Projects</h2>
                        <div className="projectCard">
                            <h3 className="projectName">Project Name</h3>
                            <p className="projectMembers"># of Members</p>
                            <p className="projectDescription">Description Here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
