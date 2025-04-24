import { Button, PasswordInput, TextInput, Text, Box, Popover, Progress } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../../api/UserAPI';
import { notifications } from '@mantine/notifications';
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
        <Text
            c={meets ? 'teal' : 'red'}
            style={{ display: 'flex', alignItems: 'center' }}
            mt={7}
            size="sm">
            {meets ? <FaCheck size={14} /> : <IoMdClose size={14} />}
            <Box ml={10}>{label}</Box>
        </Text>
    );
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
    }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function RegisterComponent() {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const registerForm = useForm({
        mode: 'controlled',
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            password: (value) =>
                requirements.map((req) => (
                    req.re.test(value)
                )).includes(false) ? 'Password requirements not met' : null,
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
    
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(registerForm.getValues().password)} />
    ));

    const strength = getStrength(registerForm.getValues().password);

    const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

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
                <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                    <Popover.Target>
                        <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}>
                            <PasswordInput
                                withAsterisk
                                className="self-stretch"
                                label="Password"
                                placeholder="•••••••••"
                                key={registerForm.key('password')}
                                {...registerForm.getInputProps('password')}
                            />
                        </div>
                        </Popover.Target>
                    <Popover.Dropdown>
                        <Progress color={color} value={strength} size={5} mb="xs" />
                        <PasswordRequirement label="Includes at least 6 characters" meets={(registerForm.getValues().password).length > 5} />
                        {checks}
                    </Popover.Dropdown>
                </Popover>
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
