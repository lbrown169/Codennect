import LoggedIn from "../components/LoggedIn";
import HeaderBar from "../components/HeaderBar";
import MenuProjects from "../components/MenuProjects";
const DashboardPage = () =>
{
    return(
        <div>
            <HeaderBar />
            <LoggedIn />
            <MenuProjects />
        </div>
    );
}
export default DashboardPage;