export function loadTransporter() {

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.email",
      port: 587,
      secure: false,
      auth: {
        user: "", // sender gmail address
        pass: "", // app password from Gmail account
      },
    });

    return transporter;

}
