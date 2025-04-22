import { isProd } from '../utils'

const app_name = 'cop4331.tech'

export function buildPath(route: string): string {
    if (isProd()) {
        return 'http://' + app_name + route
    } else {
        return 'http://localhost:5001' + route
    }
}

export function loadToken() {
    return localStorage.getItem('token')
}

export function saveToken(token: string) {
    return localStorage.setItem('token', token)
}

export function deleteToken() {
    return localStorage.removeItem('token')
}

async function makeRequest(
    method: string,
    route: string,
    headers: Record<string, string>,
    query: Record<string, string>,
    body: Record<string, string> | null
) {
    if (query) {
        route += '?' + new URLSearchParams(query).toString()
    }

    headers['Content-Type'] = 'application/json'

    const token = loadToken()
    if (token) {
        headers['Authorization'] = token
    }

    const response = await fetch(buildPath(route), {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : body,
    })
    return response
}

export async function getRequest(
    route: string,
    options?: {
        headers?: Record<string, string>
        query?: Record<string, string>
    }
) {
    return makeRequest(
        'GET',
        route,
        options?.headers ?? {},
        options?.query ?? {},
        null
    )
}

export async function postRequest(
    route: string,
    options?: {
        headers?: Record<string, string>
        query?: Record<string, string>
        body?: Record<string, string> | null
    }
) {
    return makeRequest(
        'POST',
        route,
        options?.headers ?? {},
        options?.query ?? {},
        options?.body || null
    )
}

export async function patchRequest(
    route: string,
    options?: {
        headers?: Record<string, string>
        query?: Record<string, string>
        body?: Record<string, string> | null
    }
) {
    return makeRequest(
        'PATCH',
        route,
        options?.headers ?? {},
        options?.query ?? {},
        options?.body || null
    )
}
