import { Alert, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function FailedVerifyComponent() {
    return (
        <>
            <Alert
                variant="light"
                color="red"
                title="Email Verification Failed"
            >
                The link that you followed either was invalid or expired. Try
                registering again below.
            </Alert>
            <Text size="sm">
                Click <Link to="/register">here</Link> to try registering again,
                or <Link to="/login">here</Link> to log in.
            </Text>
        </>
    );
}
