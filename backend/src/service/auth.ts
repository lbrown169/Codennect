import Mailgun from "mailgun.js";
import FormData from "form-data";

export function loadTransporter() {
    if (!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN)) {
        return null;
    }

    const mailgun = new Mailgun(FormData);

    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });

    return mg;
}
