import { useState } from 'react';
import InfoBox from "./InfoBox";
import EditInfoBox from "./EditInfoBox";
function UserProfile()
{
    const [infoText, setInfoText] = useState(<InfoBox />);
    
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    //var userData = JSON.parse(_ud);
    //var userId = userData.id;
    //var userName = userData.name;

    const profInfo = () =>
    {
        setInfoText(<InfoBox />);
        return;
    }

    const editProf = () =>
    {
        setInfoText(<EditInfoBox />);
        return;
    }

    return(
        <div id="userProfileBox" className="profileBox">
            <div id="leftDiv" className="left-side">
                <div id="pfpPlaceholder" className="pfp-placeholder"></div>
                <button type="button" id="profOverview" className="userProfileButton" onClick={profInfo}>View Profile</button>
                <button type="button" id="profEdit" className="userProfileButton" onClick={editProf}>Edit Profile</button>
                <button type="button" id="profGithub" className="userProfileButton">Github Info</button>
                <button type="button" id="profAccountInfo" className="userProfileButton">Account Information</button>
            </div>
            <div id="rightDiv" className="right-side">
                <div id="infoBox" className="infoBox">
                    {infoText}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;