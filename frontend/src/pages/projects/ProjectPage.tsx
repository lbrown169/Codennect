import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';
import { ProjectComp } from '../../components/project/Project';

const ProjectPage = () => {
    const { project_id } = useParams();
    if (!project_id) return (window.location.href = '/dashboard');

    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <ProjectComp pid={project_id} />
        </Box>
    );
};
export default ProjectPage;
