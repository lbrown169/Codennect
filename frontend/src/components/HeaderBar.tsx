import logo from '../assets/logo.png'; 

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
            <div id="headerBar" className="navBar flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow-md">
                <a href="#" onClick={goHome} className="flex items-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                    />
                </a>
                <div className="flex items-center space-x-6">
                    <a
                        href="#"
                        onClick={goHome}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Home
                    </a>
                    <a
                        href="/register"
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Register
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div id="headerBar" className="navBar flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow-md">
            <a href="#" onClick={goHome} className="flex items-center">
                <img
                    src={logo}
                    alt="Company Logo"
                    className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                />
            </a>
            <div className="flex items-center space-x-6">
                <a
                    href="#"
                    onClick={goHome}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                    Home
                </a>
                <a
                    href="/userprofile"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                    Profile
                </a>
                <a
                    href="/browse"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                    Browse Projects
                </a>
                <a
                    href="#"
                    onClick={doLogout}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                    Log Out
                </a>
            </div>
        </div>
    );
}

export default HeaderBar;
