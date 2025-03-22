export function loadTransporter() {

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.email",
      port: 587,
      secure: false,
      auth: {
        user: "rideoperatorqbozo@gmail.com", // sender gmail address
        pass: "cjbvvkdudnyiwqqd ", // app password from Gmail account
      },
    });

    return transporter;

}
