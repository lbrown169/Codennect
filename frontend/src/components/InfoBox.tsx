import React, { useState, useEffect } from 'react';

interface InfoBoxProps {
    name?: string;
    comm?: string;
    skills?: string[];
    roles?: string[];
    interests?: string[];
}

function InfoBox({ name, comm, skills, roles, interests }: InfoBoxProps) {
    const [fullName, setFullName] = useState(name || '');
    const [communication, setCommunication] = useState(comm || '');
    const [skillsState, setSkills] = useState<string[]>(skills || []);
    const [rolesState, setRoles] = useState<string[]>(roles || []);
    const [interestsState, setInterests] = useState<string[]>(interests || []);

    const app_name = "cop4331.tech";
    function buildPath(route: string): string {
        if (process.env.NODE_ENV != "production") {
            return 'http://localhost:5001' + route;
        } else {
            return 'http://' + app_name + route;
        }
    }

    const getProfile = async () => {
        const _ud = localStorage.getItem('user_data');
        if (!_ud) {
            window.location.href = '/';
            return;
        }
        const userData = JSON.parse(_ud);
        const userId = userData.id;

        // Placeholder name for API endpoint to fetch user profile
        const obj = { id: userId };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/get-user-info'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();

            if (res._id > 0) {
                alert('ERROR');
            } else {
                setFullName(res.name);
                setCommunication(res.comm);
                setSkills(res.skills);
                setRoles(res.roles);
                setInterests(res.interests);
            }
        } catch (error: any) {
            alert('Error');
        }
    };

    useEffect(() => {
        // Only fetch if props are not provided
        if (!name && !comm && !skills && !roles && !interests) {
            getProfile();
        }
    }, [name, comm, skills, roles, interests]);

    // Converts skills array into a string
    const stringArray = (theArray: string[]) => {
        let newString = '';
        if (theArray.length > 0) {
            for (let i = 0; i < theArray.length - 1; ++i) {
                newString += theArray[i] + ", ";
            }
            newString += theArray[theArray.length - 1];
        }
        return newString;
    };

    return (
        <div id="information">
            <div id="profName">
                <p>Name:</p>
                <p>{fullName}</p>
            </div>
            <div id="profCommunication" className="mt-2">
                <p>Preferred Communication Method:</p>
                <p>{communication}</p>
            </div>
            <div id="profSkills" className="mt-2">
                <p>Skills:</p>
                <p>{stringArray(skillsState)}</p>
            </div>
            <div id="profRoles" className="mt-2">
                <p>Roles:</p>
                <p>{stringArray(rolesState)}</p>
            </div>
            <div id="profInterests" className="mt-2">
                <p>Interests:</p>
                <p>{stringArray(interestsState)}</p>
            </div>
        </div>
    );
}

export default InfoBox;
