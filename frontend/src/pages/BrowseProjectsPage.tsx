import HeaderBar from "../components/HeaderBar";
import ProjectSearch from "../components/ProjectSearch";

const BrowseProjectsPage = () =>
{
    return(
        <div className="flex flex-col h-full w-full">
            <HeaderBar />
            <ProjectSearch />
        </div>
    )
};
export default BrowseProjectsPage;