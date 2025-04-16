import HeaderBar from '../components/HeaderBar.tsx';
import {useParams} from "react-router-dom";
import { ProjectComp } from '../components/Project.tsx';

const ProjectPage = () =>
{
    const { project_id } = useParams();
    if (!project_id) return window.location.href = "/dashboard"

    return(
        <div className='flex flex-col w-screen min-h-screen overflow-hidden'>
        <HeaderBar />
        <ProjectComp pid={project_id} />
        </div>
    );
};
export default ProjectPage;