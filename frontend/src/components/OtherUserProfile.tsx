import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isProd } from '../utils';
import InfoBox from './InfoBox';

const app_name = "cop4331.tech";

function buildPath(route: string): string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

function OtherUserProfile() {
    const { id } = useParams<{ id: string }>();
    const [userData, setUserData] = useState({ name: '', comm: '', skills: [], roles: [], interests: [] });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const _ud = localStorage.getItem('user_data');
            if (!_ud) {
                window.location.href = '/login';
                return;
            }

            const user = JSON.parse(_ud);

            try {
                setIsLoading(true);
                const response = await fetch(buildPath('/api/get-user-info'), {
                    method: 'POST',
                    body: JSON.stringify({ id }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (data._id > 0) {
                    setMessage('Failed to load user profile.');
                } else {
                    setUserData({
                        name: data.name,
                        comm: data.comm,
                        skills: data.skills,
                        roles: data.roles,
                        interests: data.interests,
                    });
                }
            } catch (error: any) {
                setMessage('Failed to load user profile.');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    return (
        <div id="otherUserProfileBox" className="profileBox">
            <div id="rightDiv" className="right-side">
                <div id="infoBox" className="infoBox">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <InfoBox
                                name={userData.name}
                                comm={userData.comm}
                                skills={userData.skills}
                                roles={userData.roles}
                                interests={userData.interests}
                            />
                            {message && (
                                <div id="profileResultDiv">
                                    <span id="profileResult">{message}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OtherUserProfile;
