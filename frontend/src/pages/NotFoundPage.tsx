import { Title, Box, Text } from '@mantine/core';

export default function NotFoundPage() {
    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                404 Error: Page Not Found
            </Title>
            <Text>
                Looks like that you followed a broken link. Use the sidebar on
                the left to get back on track.
            </Text>
        </Box>
    );
}
