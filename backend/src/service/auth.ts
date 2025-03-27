export function loadTransporter() {

    const nodemailer = require("nodemailer");

    // TODO Set up a gmail email for the sole purpose of email verification for this project
    const transporter = nodemailer.createTransport({
      host: process.env.HOST, //'smtp.gmail.com' - I will implement a gmail specifically for this
      service: process.env.SERVICE, //I might delete this
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER, //put in gmail email
        pass: process.env.PASS, //create an app on the gmail
      },
    });

    return transporter;

}
