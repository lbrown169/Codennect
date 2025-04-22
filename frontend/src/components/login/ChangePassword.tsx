import { Button, PasswordInput, TextInput, Text, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link, useSearchParams } from 'react-router-dom'
import { ChangePassword } from '../../api/UserAPI'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'

export default function ChangePasswordComponent() {
    const [searchParams, _] = useSearchParams()
    const [submitted, setSubmitted] = useState(false)
    const changeForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords do not match' : null,
        },
    })

    async function onChangeSubmit({
        email,
        password,
    }: {
        email: string
        password: string
    }) {
        try {
            await ChangePassword(searchParams.get('token')!, email, password)
            setSubmitted(true)
        } catch (err) {
            console.log(err)
            notifications.show({
                title: 'Something went wrong',
                message: 'We failed to register you, please try again later.',
                color: 'red',
            })
        }
    }

    if (!searchParams.get('token')) {
        return (
            <>
                <Alert
                    variant="light"
                    color="red"
                    title="Email Verification Failed"
                >
                    The link that you followed either was invalid or expired.
                    Try sending a new password reset.
                </Alert>
                <Text size="sm">
                    Click <Link to="/register">here</Link> to try registering
                    again, or <Link to="/login">here</Link> to log in.
                </Text>
            </>
        )
    }

    if (submitted) {
        return (
            <>
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="Password Successfully Changed"
                >
                    Your password has successfully been changed. You can now
                    login from your previous session, or here.
                    <br />
                </Alert>
                <Text size="sm">
                    Click <Link to="/login">here</Link> to log in.
                </Text>
            </>
        )
    }

    return (
        <>
            <Text size="sm">Enter your email and new password below.</Text>
            <form
                className="flex flex-col self-stretch gap-3"
                onSubmit={changeForm.onSubmit((values) =>
                    onChangeSubmit(values)
                )}
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="john.doe@example.com"
                    key={changeForm.key('email')}
                    {...changeForm.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    className="self-stretch"
                    label="New Password"
                    placeholder="•••••••••"
                    key={changeForm.key('password')}
                    {...changeForm.getInputProps('password')}
                />
                <PasswordInput
                    withAsterisk
                    className="self-stretch"
                    label="Re-type New Password"
                    placeholder="•••••••••"
                    key={changeForm.key('confirmPassword')}
                    {...changeForm.getInputProps('confirmPassword')}
                />
                <Button type="submit" color="#5c8593">
                    Change Password
                </Button>
            </form>
            <Text size="sm">
                Remember your credentials suddenly?{' '}
                <Link to="/login">Log in</Link>
            </Text>
        </>
    )
}
