export function isProd() {
    return process.env.NODE_ENV === "production";
}

export function getVersion() {
    return process.env.VERSION;
}
