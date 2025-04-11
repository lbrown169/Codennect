import LoggedIn from "../components/LoggedIn";
import HeaderBar from "../components/HeaderBar";
const DashboardPage = () =>
{
    return(
        <div>
            <HeaderBar />
            <LoggedIn />
            <h1 className="text-center">Welcome!</h1>
        </div>
    );
}
export default DashboardPage;