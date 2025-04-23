import { IncorrectCredentials, VerificationRequired } from '../types/Errors';
import { getRequest, patchRequest, postRequest, saveToken } from './utils';

export async function getMyInfo() {
    return await getRequest('/api/users/me');
}

export async function getUserInfo(user_id: string) {
    return await getRequest(`/api/users/${user_id}`);
}

export async function Login(email: string, password: string) {
    const response = await postRequest('/api/auth/login', {
        body: { email: email, password: password },
    });

    if (response.status === 400) {
        throw new IncorrectCredentials('Email and/or password incorrect');
    } else if (response.status === 412) {
        throw new VerificationRequired('Account not yet verified');
    } else if (response.status !== 200) {
        console.log(await response.text());
        throw new Error('We failed to log you in, please try again later.');
    } else {
        const data = await response.json();
        saveToken(data.Authorization);
    }
}

export async function Register(email: string, name: string, password: string) {
    const response = await postRequest('/api/auth/register', {
        body: { email: email, name: name, password: password },
    });

    if (response.status !== 200) {
        console.log(await response.text());
        throw new Error('We failed to register you, please try again later.');
    }
}

export async function ChangePassword(
    token: string,
    email: string,
    password: string
) {
    const response = await patchRequest('/api/auth/change-password', {
        body: { email: email, verificationCode: token, newPassword: password },
    });

    if (response.status === 400) {
        throw new IncorrectCredentials('Email is incorrect');
    } else if (response.status > 299) {
        console.log(await response.text());
        throw new Error(
            'We failed to change your password, please try again later.'
        );
    }
}

export async function SendReset(email: string) {
    const response = await postRequest(`/api/auth/send-reset`, {
        body: { email: email },
    });

    if (response.status !== 200) {
        console.log(await response.text());
        throw new Error(
            'We failed to send a reset email, please try again later.'
        );
    }
}
