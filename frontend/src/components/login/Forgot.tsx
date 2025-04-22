import { useForm } from '@mantine/form'
import { Button, TextInput, Text, Alert } from '@mantine/core'
import { Link } from 'react-router-dom'
import { SendReset } from '../../api/UserAPI'
import { useState } from 'react'

export default function ForgotComponent() {
    const [submitted, setSubmitted] = useState(false)
    const forgotForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
        },
    })

    async function onForgotSubmit({ email }: { email: string }) {
        await SendReset(email)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <>
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="Password Reset Sent"
                >
                    If that email is registered, we've sent a link to it in
                    order to reset your password.
                    <br />
                </Alert>
                <Text size="sm">
                    Remember your credentials suddenly?{' '}
                    <Link to="/login">Log in</Link>
                </Text>
            </>
        )
    }

    return (
        <>
            <Text size="sm">
                Forgot your password? No worries. Enter your email below and
                we'll send you a password reset email.
            </Text>
            <form
                className="flex flex-col self-stretch gap-3"
                onSubmit={forgotForm.onSubmit((values) =>
                    onForgotSubmit(values)
                )}
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="john.doe@example.com"
                    key={forgotForm.key('email')}
                    {...forgotForm.getInputProps('email')}
                />
                <Button type="submit" color="#5c8593">
                    Send Password Reset
                </Button>
            </form>
            <Text size="sm">
                Remember your credentials suddenly?{' '}
                <Link to="/login">Log in</Link>
            </Text>
        </>
    )
}
