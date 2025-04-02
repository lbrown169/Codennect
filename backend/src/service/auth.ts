export function loadTransporter() {

    const nodemailer = require("nodemailer");

    // TODO Set up a gmail email for the sole purpose of email verification for this project
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "noreply.codennect@gmail.com",
        pass: "xrdfvnagkmawwalo ",
      },
    });

    return transporter;

}
