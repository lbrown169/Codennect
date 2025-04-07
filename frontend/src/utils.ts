export function isProd() {
    return import.meta.env.PROD;
}

export function getVersion() {
    return import.meta.env.VITE_VERSION;
}
