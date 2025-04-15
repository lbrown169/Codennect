import React, { useState, useEffect } from 'react';
import { isProd } from '../utils';
import InfoBox from './InfoBox';
import EditInfoBox from './EditInfoBox';

const app_name = "cop4331.tech";

function buildPath(route: string): string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

function UserProfile() {
    const [view, setView] = useState('info'); // 'info', 'edit', 'projects', 'invites'
    const [projects, setProjects] = useState([]);
    const [invites, setInvites] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProjectsAndInvites = async () => {
            const _ud = localStorage.getItem('user_data');
            if (!_ud) {
                window.location.href = '/login';
                return;
            }

            const user = JSON.parse(_ud);

            try {
                setIsLoading(true);

                // Placeholder name for API endpoint to fetch user projects
                const projectsResponse = await fetch(buildPath('/api/user/projects'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const projectsData = await projectsResponse.json();
                if (projectsData.error) {
                    setMessage(projectsData.error);
                } else {
                    setProjects(projectsData.projects || []);
                }

                // Placeholder name for API endpoint to fetch project invites
                const invitesResponse = await fetch(buildPath('/api/invites'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const invitesData = await invitesResponse.json();
                if (invitesData.error) {
                    setMessage(invitesData.error);
                } else {
                    setInvites(invitesData.invites || []);
                }
            } catch (error: any) {
                setMessage('Failed to load data. Please try again.');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectsAndInvites();
    }, []);

    const handleAcceptInvite = async (inviteId: string) => {
        // Placeholder name for API endpoint to accept a project invite
        setMessage('Invite acceptance not implemented yet.');
    };

    const handleDenyInvite = async (inviteId: string) => {
        // Placeholder name for API endpoint to deny a project invite
        setMessage('Invite denial not implemented yet.');
    };

    const renderContent = () => {
        if (isLoading) {
            return <p>Loading...</p>;
        }
        switch (view) {
            case 'info':
                return <InfoBox />; // No props, InfoBox fetches current user's data
            case 'edit':
                return <EditInfoBox />;
            case 'projects':
                return (
                    <div>
                        <h2>My Projects</h2>
                        {projects.length > 0 ? (
                            <ul>
                                {projects.map((project: any) => (
                                    <li key={project.id}>{project.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No projects found.</p>
                        )}
                    </div>
                );
            case 'invites':
                return (
                    <div>
                        <h2>Project Invites</h2>
                        {invites.length > 0 ? (
                            <ul>
                                {invites.map((invite: any) => (
                                    <li key={invite.id}>
                                        {invite.projectName}
                                        <button onClick={() => handleAcceptInvite(invite.id)}>Accept</button>
                                        <button onClick={() => handleDenyInvite(invite.id)}>Deny</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No invites found.</p>
                        )}
                    </div>
                );
            default:
                return <InfoBox />;
        }
    };

    return (
        <div id="userProfileBox" className="profileBox">
            <div id="leftDiv" className="left-side">
                <div id="pfpPlaceholder" className="pfp-placeholder"></div>
                <button
                    type="button"
                    id="profOverview"
                    className="userProfileButton"
                    onClick={() => setView('info')}
                >
                    View Profile
                </button>
                <button
                    type="button"
                    id="profEdit"
                    className="userProfileButton"
                    onClick={() => setView('edit')}
                >
                    Edit Profile
                </button>
                <button
                    type="button"
                    id="profProjects"
                    className="userProfileButton"
                    onClick={() => setView('projects')}
                >
                    View Projects
                </button>
                <button
                    type="button"
                    id="profInvites"
                    className="userProfileButton"
                    onClick={() => setView('invites')}
                >
                    Manage Invites
                </button>
                <div id="profileResultDiv">
                    <span id="profileResult">{message}</span>
                </div>
            </div>
            <div id="rightDiv" className="right-side">
                <div id="infoBox" className="infoBox">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
