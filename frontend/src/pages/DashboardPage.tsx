import LoggedIn from "../components/LoggedIn";
import HeaderBar from "../components/HeaderBar";
import MenuProjects from "../components/MenuProjects";
import MenuUsers from "../components/MenuUsers";
const DashboardPage = () =>
{
    return(
        <div>
            <HeaderBar />
            <LoggedIn />
            <MenuProjects />
            <MenuUsers />
        </div>
    );
}
export default DashboardPage;