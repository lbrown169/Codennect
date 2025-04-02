function HeaderBar()
{
    const goHome = (event: React.MouseEvent) =>
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

    return(
        <div id="headerBar" className="navBar">
            <a href="#" onClick={goHome}>Home</a>
        </div>
    );
};
export default HeaderBar;