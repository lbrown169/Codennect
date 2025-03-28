

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
            <p>Test</p>
        </div>
    );
}

export default UserProfile;