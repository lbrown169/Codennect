import { useParams } from 'react-router-dom';
import { Box, Title } from '@mantine/core';

const ProjectPage = () => {
    const { project_id } = useParams();
    if (!project_id) return (window.location.href = '/dashboard');

    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                Project
            </Title>
        </Box>
    );
};
export default ProjectPage;
