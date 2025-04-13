export function isProd() {
    return process.env.NODE_ENV === "production";
}

export function getVersion() {
    return process.env.VERSION;
}

export function buildUrl(path: string) {
    if (isProd()) {
        return "https://cop4331.tech" + path;
    } else {
        return "http://localhost:5001" + path;
    }
}
