

function UserProfile()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    return(
        <div id="userProfileBox" className="profileBox">
            <div id="leftDiv" className="left-side">
                <div id="pfpPlaceholder" className="pfp-placeholder"></div>
                <button type="button" id="profOverview" className="userProfileButton"></button>
                <button type="button" id="profEdit" className="userProfileButton"></button>
                <button type="button" id="profGithub" className="userProfileButton"></button>
                <button type="button" id="profAccountInfo" className="userProfileButton"></button>
            </div>
            <div id="rightDiv" className="right-side">
                <div id="infoBox" className="infoBox"></div>
            </div>
        </div>
    );
}

export default UserProfile;