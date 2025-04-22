import { Alert, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function VerifiedComponent() {
    return (
        <>
            <Alert variant="light" color="#5c8593" title="Email Verified!">
                Your email has successfully been verified. You can now continue
                your previous session, or login below.
            </Alert>
            <Text size="sm">
                Click <Link to="/login">here</Link> if you would like to login.
            </Text>
        </>
    );
}
