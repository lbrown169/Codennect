import { useContext, useEffect } from 'react';
import { UserContext } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Container, Title, Image } from '@mantine/core';
import LoginComponent from '../components/login/Login';
import RegisterComponent from '../components/login/Register';
import VerifyComponent from '../components/login/Verify';
import ForgotComponent from '../components/login/Forgot';
import ChangePasswordComponent from '../components/login/ChangePassword';
import VerifiedComponent from '../components/login/Verified';
import FailedVerifyComponent from '../components/login/FailedVerify';

export default function LoginPage({
    mode,
}: {
    mode:
        | 'login'
        | 'register'
        | 'verify'
        | 'verified'
        | 'failed-verify'
        | 'forgot'
        | 'change';
}) {
    const { user, loaded, verified } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (loaded && user && verified) {
            navigate('/');
        }
    }, [loaded, user, verified]);

    return (
        <Box className="h-full w-full flex flex-col pt-45 bg-stone-100 bg-[url('/background.png')] bg-cover">
            <Container>
                <Card
                    className="gap-5 items-start max-w-150"
                    shadow="sm"
                    padding="xl"
                    radius="md"
                    withBorder
                >
                    <Image
                        className="self-center"
                        h={75}
                        w={75}
                        src="/favicon.png"
                        alt="Logo"
                    />
                    <Title order={1}>Welcome to Codennect!</Title>
                    {mode === 'login' ? (
                        <LoginComponent />
                    ) : mode === 'register' ? (
                        <RegisterComponent />
                    ) : mode === 'verify' ? (
                        <VerifyComponent />
                    ) : mode === 'verified' ? (
                        <VerifiedComponent />
                    ) : mode === 'failed-verify' ? (
                        <FailedVerifyComponent />
                    ) : mode === 'forgot' ? (
                        <ForgotComponent />
                    ) : mode === 'change' ? (
                        <ChangePasswordComponent />
                    ) : (
                        <></>
                    )}
                </Card>
            </Container>
        </Box>
    );
}
