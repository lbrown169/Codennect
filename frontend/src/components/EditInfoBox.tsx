import React, { useState, useEffect } from 'react';

function EditInfoBox() {
    var _ud = localStorage.getItem('user_data');
    if (_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }
    var userData = JSON.parse(_ud);
    var userId = userData.id;
    var userName = userData.name;

    const app_name = "cop4331.tech";
    function buildPath(route: string): string {
        if (process.env.NODE_ENV != "production") {
            return 'http://localhost:5001' + route;
        } else {
            return 'http://' + app_name + route;
        }
    }

    const [fullName, setFullName] = useState(userName);
    const [communication, setCommunication] = useState('');
    const [skills, setSkills] = useState('');
    const [roles, setRoles] = useState('');
    const [interests, setInterests] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //stores initial values
    const [initFullName, setInitFullName] = useState('');
    const [initCommunication, setInitCommunication] = useState('');
    const [initSkills, setInitSkills] = useState('');
    const [initRoles, setInitRoles] = useState('');
    const [initInterests, setInitInterests] = useState('');

    const handleSetFullName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFullName(e.target.value);
    };
    const handleSetCommunication = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommunication(e.target.value);
    };
    const handleSetSkills = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSkills(e.target.value);
    };
    const handleSetRoles = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRoles(e.target.value);
    };
    const handleSetInterests = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInterests(e.target.value);
    };

    const getProfile = async () => {
        const obj = { id: userId };
        const js = JSON.stringify(obj);

        try {
            setIsLoading(true);
            const response = await fetch(buildPath('/api/get-user-info'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();

            if (res._id > 0) {
                setEditMessage('Failed to load profile.');
            } else {
                setFullName(res.name);
                setCommunication(res.comm);
                setSkills(res.skills.join(','));
                setRoles(res.roles.join(','));
                setInterests(res.interests.join(','));

                setInitFullName(res.name);
                setInitCommunication(res.comm);
                setInitSkills(res.skills.join(','));
                setInitRoles(res.roles.join(','));
                setInitInterests(res.interests.join(','));
            }
        } catch (error: any) {
            setEditMessage('Error loading profile.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleReset = () => {
        setFullName(initFullName);
        setCommunication(initCommunication);
        setSkills(initSkills);
        setRoles(initRoles);
        setInterests(initInterests);
        setEditMessage('');
    };

    const validateInput = () => {
        if (!fullName) return 'Please enter a name';
        if (!communication) return 'Please enter a communication method';
        if (!skills) return 'Please enter at least one skill';
        if (!roles) return 'Please enter at least one role';
        if (!interests) return 'Please enter at least one interest';
        return '';
    };

    const confirmEdits = async (event: React.FormEvent) => {
        event.preventDefault();

        const inputError = validateInput();
        if (inputError) {
            setEditMessage(inputError);
            return;
        }

        setIsLoading(true);
        const obj = {
            id: userId,
            name: fullName,
            comm: communication,
            skills: skills.split(',').map((s: string) => s.trim()),
            roles: roles.split(',').map((r: string) => r.trim()),
            interests: interests.split(',').map((i: string) => i.trim()),
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/update-user-info'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();

            if (res.error) {
                setEditMessage(res.error);
            } else {
                setEditMessage('Profile updated successfully!');
                setInitFullName(fullName);
                setInitCommunication(communication);
                setInitSkills(skills);
                setInitRoles(roles);
                setInitInterests(interests);
            }
        } catch (error: any) {
            setEditMessage('Failed to update profile.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form id="informationForm" onSubmit={confirmEdits}>
            <div id="info" className="infoDisplay">
                <div id="newNameDiv">
                    <div id="newNameLabel">
                        <label>Name:</label>
                    </div>
                    <textarea
                        className="infoInput"
                        rows={1}
                        id="newName"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={handleSetFullName}
                        disabled={isLoading}
                    />
                </div>
                <div id="newCommunicationDiv" className="mt-2">
                    <div id="newCommunicationLabel">
                        <label>Preferred Communication Method:</label>
                    </div>
                    <textarea
                        className="infoInput"
                        id="newCommunication"
                        placeholder="Preferred communication method"
                        value={communication}
                        onChange={handleSetCommunication}
                        disabled={isLoading}
                    />
                </div>
                <div id="newSkillsDiv" className="mt-2">
                    <div id="newSkillsLabel">
                        <label>Skills:</label>
                        <p className="text-sm">Separate each skill with a comma and no space (EX: skill1,skill2,...)</p>
                    </div>
                    <textarea
                        className="infoInput"
                        id="newSkills"
                        placeholder="Skills"
                        value={skills}
                        onChange={handleSetSkills}
                        disabled={isLoading}
                    />
                </div>
                <div id="NewRolesDiv" className="mt-2">
                    <div id="newRolesLabel">
                        <label>Roles:</label>
                        <p className="text-sm">Separate each role with a comma and no space (EX: frontend,backend)</p>
                    </div>
                    <textarea
                        className="infoInput"
                        id="newRoles"
                        placeholder="Roles"
                        value={roles}
                        onChange={handleSetRoles}
                        disabled={isLoading}
                    />
                </div>
                <div id="newInterestsDiv" className="mt-2">
                    <div id="newInterestsLabel">
                        <label>Interests:</label>
                    </div>
                    <textarea
                        className="infoInput"
                        id="newInterests"
                        placeholder="Interests"
                        value={interests}
                        onChange={handleSetInterests}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div id="editProfResultDiv">
                <span id="editProfResult">{editMessage}</span>
            </div>
            <div id="editProfButtons">
                <button
                    type="reset"
                    className="resetButton"
                    onClick={handleReset}
                    disabled={isLoading}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="submitButton"
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
}

export default EditInfoBox;
