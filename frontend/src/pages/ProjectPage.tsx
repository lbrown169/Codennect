import HeaderBar from '../components/HeaderBar.tsx';
import {useParams} from "react-router-dom";
import { Project } from '../components/Project.tsx';

const ProjectPage = () =>
{
    const { project_id } = useParams();
    if (!project_id) return window.location.href = "/dashboard"

    return(
        <div className='flex flex-col'>
        <HeaderBar />
        <Project pid={project_id} />
        </div>
    );
};
export default ProjectPage;