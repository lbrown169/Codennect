import { Title, Box } from '@mantine/core'

export default function MyProfilePage() {
    return (
        <Box mx={{ base: 'md', lg: 'xl' }}>
            <Title py="md" order={1}>
                My Profile
            </Title>
        </Box>
    )
}
