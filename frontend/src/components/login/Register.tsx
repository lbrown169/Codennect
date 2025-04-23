import { Button, PasswordInput, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../../api/UserAPI';
import { notifications } from '@mantine/notifications';

export default function RegisterComponent() {
    const registerForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords do not match' : null,
        },
    });
    const navigate = useNavigate();

    async function onRegisterSubmit({
        email,
        name,
        password,
    }: {
        email: string;
        name: string;
        password: string;
    }) {
        try {
            await Register(email, name, password);
            navigate('/verify');
        } catch (err) {
            console.log(err);
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to register you, please try again later.',
                color: 'red',
            });
        }
    }

    return (
        <>
            <form
                className="flex flex-col self-stretch gap-3"
                onSubmit={registerForm.onSubmit((values) =>
                    onRegisterSubmit(values)
                )}
            >
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="John Doe"
                    key={registerForm.key('name')}
                    {...registerForm.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="john.doe@example.com"
                    key={registerForm.key('email')}
                    {...registerForm.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    className="self-stretch"
                    label="Password"
                    placeholder="•••••••••"
                    key={registerForm.key('password')}
                    {...registerForm.getInputProps('password')}
                />
                <PasswordInput
                    withAsterisk
                    className="self-stretch"
                    label="Re-type Password"
                    placeholder="•••••••••"
                    key={registerForm.key('confirmPassword')}
                    {...registerForm.getInputProps('confirmPassword')}
                />
                <Button type="submit" color="#5c8593">
                    Register
                </Button>
            </form>
            <Text size="sm">
                Have an account already? <Link to="/login">Log in</Link>
            </Text>
        </>
    );
}
