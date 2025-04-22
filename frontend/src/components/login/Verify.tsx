import { Alert, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function VerifyComponent() {
    return (
        <>
            <Alert
                variant="light"
                color="#5c8593"
                title="Email Verification Required"
            >
                Before we log you in, we need you to verify your email. Please
                check your email and click the link to finish the registration
                process.
                <br />
            </Alert>
            <Text size="sm">
                Click <Link to="/">here</Link> when your email has been
                verified, or <Link to="/logout">here</Link> to log out.
            </Text>
        </>
    )
}
