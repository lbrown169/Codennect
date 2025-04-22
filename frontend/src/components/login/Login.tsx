import { useContext } from 'react';
import { LoadData, UserContext } from '../../hooks/UserContext';
import { useForm } from '@mantine/form';
import { Button, PasswordInput, TextInput, Text } from '@mantine/core';
import { Login } from '../../api/UserAPI';
import { Link, useNavigate } from 'react-router-dom';
import { IncorrectCredentials, VerificationRequired } from '../../types/Errors';
import { notifications } from '@mantine/notifications';

export default function LoginComponent() {
    const { setUser, setVerified } = useContext(UserContext);
    const navigate = useNavigate();

    const loginForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
        },
    });

    async function onLoginSubmit({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) {
        try {
            await Login(email, password);
            await LoadData(setUser, setVerified);
            navigate('/');
        } catch (err) {
            if (err instanceof IncorrectCredentials) {
                loginForm.setErrors({ password: err.message });
            } else if (err instanceof VerificationRequired) {
                navigate('/verify');
            } else if (err instanceof Error) {
                console.log(err);
                notifications.show({
                    title: 'Something went wrong',
                    message: 'We failed to log you in, please try again later.',
                    color: 'red',
                });
            }
        }
    }

    return (
        <>
            <form
                className="flex flex-col self-stretch gap-3"
                onSubmit={loginForm.onSubmit((values) => onLoginSubmit(values))}
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="john.doe@example.com"
                    key={loginForm.key('email')}
                    {...loginForm.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    className="self-stretch"
                    label="Password"
                    placeholder="•••••••••"
                    key={loginForm.key('password')}
                    {...loginForm.getInputProps('password')}
                />
                <Button type="submit" color="#5c8593">
                    Login
                </Button>
            </form>
            <Text size="sm">
                Having difficulty? <Link to="/register">Sign up</Link> or{' '}
                <Link to="/forgot-password">Forgot Password</Link>
            </Text>
        </>
    );
}
