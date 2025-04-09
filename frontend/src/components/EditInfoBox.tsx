import React, { useState } from 'react';
function EditInfoBox()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }
    var userData = JSON.parse(_ud);
    //var userId = userData.id;
    var userName = userData.name;

    const [fullName, setFullName] = useState(userName);
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [interests, setInterests] = useState('');
    const [editMessage, setEditMessage] = useState('Test');
    
    const handleSetFullName = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setFullName(e.target.value);
    }
    const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setDescription(e.target.value);
    }
    const handleSetSkills = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setSkills(e.target.value);
    }
    const handleSetInterests = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setInterests(e.target.value);
    }

    const handleReset = () =>
    {
        setFullName(userName);
        setDescription('');
        setSkills('');
        setInterests('');
    }
    const confirmEdits = async (event: React.FormEvent) =>
    {
        event.preventDefault();
        alert('Not yet implemented');
    }

    return(
        <form id="informationForm">
            <div id="info" className="infoDisplay">
                <div id="newNameDiv">
                    <div id="newNameLabel">
                        <label>Name:</label>
                    </div>
                    <input
                        className = "infoInput"
                        type = "text"
                        id = "newName"
                        placeholder = "Full Name"
                        value = {fullName}
                        onChange = {handleSetFullName}
                    />
                </div>
                <div id="newDescriptionDiv" className="mt-2">
                    <div id="newDescriptionLabel">
                        <label>Description:</label>
                    </div>
                    <textarea 
                        className = "infoInput"
                        rows = "3"
                        id = "newDescription"
                        placeholder = "Description"
                        value = {description}
                        onChange = {handleSetDescription}
                    />
                </div>
                <div id="newSkillsDiv" className="mt-2">
                    <div id="newSkillsLabel">
                        <label>Skills:</label>
                    </div>
                    <textarea 
                        className = "infoInput"
                        rows = "2"
                        id = "newSkills"
                        placeholder = "Skills"
                        value = {skills}
                        onChange = {handleSetSkills}
                    />
                </div>
                <div id="newInterestsDiv" className="mt-2">
                    <div id="newInterestsLabel">
                        <label>Interests:</label>
                    </div>
                    <textarea 
                        className = "infoInput"
                        rows = "2"
                        id = "newInterests"
                        placeholder = "Interests"
                        value = {interests}
                        onChange = {handleSetInterests}
                    />
                </div>
            </div>
            <div id="editProfResultDiv">
                <span id="editProfResult">{editMessage}</span>
            </div>
            <div id="editProfButtons">
                <button type="reset" className="resetButton" onClick={handleReset}>Reset</button>
                <button type="submit" className="submitButton" onClick={confirmEdits}>Submit</button>
            </div>
        </form>
    );

}
export default EditInfoBox;