function HeaderBar() {
    const goHome = (_event: React.MouseEvent) => {
        var _ud = localStorage.getItem('user_data');
        if (_ud == null) {
            window.location.href = '/';
            return;
        }
        window.location.href = '/dashboard';
        return;
    };

    const doLogout = (event: any) => {
        event.preventDefault();
        localStorage.removeItem("user_data");
        window.location.href = '/';
    };

    var _ud = localStorage.getItem('user_data');
    if (_ud == null) {
        return (
            <div id="headerBar" className="navBar flex items-center space-x-4">
                <a href="#" onClick={goHome}>
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </a>
                <a href="#" onClick={goHome}>Home</a>
                <a href="/register">Register</a>
            </div>
        );
    }

    return (
        <div id="headerBar" className="navBar flex items-center space-x-4">
            <a href="#" onClick={goHome}>
                <img src="/logo.png" alt="Logo" className="h-8" />
            </a>
            <a href="#" onClick={goHome}>Home</a>
            <a href="/userprofile">Profile</a>
            <a href="/browse">Browse Projects</a>
            <a href="#" className="float-right inset-y-[-8px]" onClick={doLogout}>Log Out</a>
        </div>
    );
}

export default HeaderBar;
