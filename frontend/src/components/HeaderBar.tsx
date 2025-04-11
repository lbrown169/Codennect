function HeaderBar()
{
    const goHome = (_event: React.MouseEvent) =>
    {
        var _ud = localStorage.getItem('user_data');
        if(_ud == null) //redirect if user not found
        {
            window.location.href = '/';
            return;
        }
        window.location.href = '/dashboard';
        return;
    };

    const doLogout = (event:any) =>
    {
        event.preventDefault();
        localStorage.removeItem("user_data");
        window.location.href = '/';
    };

    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //default header bar
    {
        return(
            <div id="headerBar" className="navBar">
                <a href="#" onClick={goHome}>Home</a>
                <a href="/register">Register</a>
            </div>
        );
    }

    //logged in header
    return(
        <div id="headerBar" className="navBar space-x-4">
            <a href="#" onClick={goHome}>Home</a>
            <a href="/userprofile">Profile</a>
            <a href="#" className="float-right inset-y-[-8px]" onClick={doLogout}>Log Out</a>
        </div>
    );
};
export default HeaderBar;