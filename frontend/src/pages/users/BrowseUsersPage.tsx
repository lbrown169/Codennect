import { Title, Box } from '@mantine/core';
import { UserSearchBar } from '../../components/browse/UserSearchBar';

export default function BrowseUsersPage() {
    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                Users
            </Title>
            <UserSearchBar />
        </Box>
    );
}
