// import ProjectSearch from "../components/ProjectSearch";

import { Box, Title } from '@mantine/core';

// const BrowseProjectsPage = () =>
// {
//     return(
//         <div className="flex flex-col h-full w-full">
//             <ProjectSearch />
//         </div>
//     )
// };
// export default BrowseProjectsPage;

export default function BrowseProjectsPage() {
    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                Projects
            </Title>
        </Box>
    );
}
