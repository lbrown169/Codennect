function Sidebar() {
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
            <div
                id="sidebar"
                className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white shadow-lg flex flex-col p-6"
            >
                <nav className="flex flex-col space-y-4">
                    <a
                        href="#"
                        onClick={goHome}
                        className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Home
                    </a>
                    <a
                        href="/register"
                        className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Register
                    </a>
                </nav>
            </div>
        );
    }

    return (
        <div
            id="sidebar"
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white shadow-lg flex flex-col p-6"
        >
            <nav className="flex flex-col space-y-4">
                <a
                    href="#"
                    onClick={goHome}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                    Home
                </a>
                <a
                    href="/myuser"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                    MyUser
                </a>
                <a
                    href="/editmyuser"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                    EditMyUser
                </a>
                <a
                    href="/searchuser"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                    SearchUser
                </a>
                <a
                    href="/myinvites"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                    MyInvites
                </a>
                <a
                    href="#"
                    onClick={doLogout}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200 mt-auto"
                >
                    Log Out
                </a>
            </nav>
        </div>
    );
}

export default Sidebar;
