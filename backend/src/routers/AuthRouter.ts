import express, { Request } from "express";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

import { UserRegistration, VerificationInUser } from "../domain/User.js";
import { buildUrl, Response } from "../utils.js";
import { Driver } from "../repo/Driver.js";
import { config } from "dotenv";
import { error } from "console";

const AuthRouter = express.Router();

const JWT_EXPIRES_IN = "1h";

// Route to accept email and send verification
AuthRouter.post("/api/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const db: Driver = req.app.locals.driver;

  // Check for email, then see if one ties to a user
  if (!email) {
    res.status(400).json({ error: "Email is required", });
    return;
  }

  // Check that name and password are valid entries
  if (!name || !password) {
    res.status(400).send({ error: "Invalid name or password.", });
    return;
  }

  // make sure there's not already a registered user with this login
  const existingUser = await db.userRepository.GetByEmail(email);
  if (existingUser != null) {
    // Silently fail to not expose existing user
    res.json({ error: "", message: "Verification email sent.", });
    return;
  }

  // Generate token and put into registration object
  const token = randomBytes(32).toString("hex");
  const userVerification = {code: token, newUser: true, expires: Date.now() + 15 * 60 * 1000} as VerificationInUser;

  // add user to repo
  const newUser = new UserRegistration(name, email, password, userVerification);

  // insert the new user into the database using UserRepo
  const registeredUser = await db.userRepository.Register(newUser);

  // Link to email
  const verificationLink = buildUrl(`/verify-email?token=${token}`);
  // Email
  if (req.app.locals.transporter) {
    let message = `
        Hey there ${email},<br /><br />

        You're almost there! Click <a href="${verificationLink}">here</a> to finish your registration.
        `;
    const info = await req.app.locals.transporter.messages.create(
      process.env.MAILGUN_DOMAIN!,
      {
        from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Verify your email",
        html: message,
      }
    );
    console.log("Verification email sent.", info);
  } else {
    console.info("Mailgun credentials were not specified, verification link:");
    console.info(verificationLink);
  }
  res.json({ message: "Verification email sent." });
});

// Route to verify token
AuthRouter.post("/api/verify-email", async (req: Request, res: Response) => {
  // This is why we need the token in the database
  const { token, email } = req.body;
  const db: Driver = req.app.locals.driver;

  // Validate token
  const verifyAttempt = await db.userRepository.ValidateVerification(token);
  if (!verifyAttempt) {
    res.status(400).send({ error: "Invalid or expired token.", });
    return;
  }

  // once user is verified, can remove the verification and make user usable
  await db.userRepository.DeleteVerification(token);

  // return a successful registration message
  res.status(201).json({ error: "", result: "User registered successfully!", });
});

AuthRouter.post("/api/login", async (req: Request, res: Response) => {
  // incoming: email, password
  // outgoing: id, name, error
  const { email, password } = req.body;
  const db: Driver = req.app.locals.driver;

  const theUser = await db.userRepository.GetByEmailAndPassword(
    email,
    password
  );

  // more specific error based on email OR password
  if (theUser == null) {
    res.status(400).json({ error: "User not found!", });
    return;
  }

  const token = jwt.sign(
    { _id: theUser._id },
    process.env.JWT_SECRET_KEY || "your-secret-key",
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  // Cookie res
  res.cookie("token", token, {
    httpOnly: true,
    signed: true,
    maxAge: 3600000,
  });

  // Return token in json directly (yeah yeah, not a best practice)
  res.json({ error: "", id: theUser._id, name: theUser.name, "Authorization": token });
});

AuthRouter.post("/api/logout", async (req: Request, res: Response) => {
  if (res.locals.user) {
    res.clearCookie("token");
  }

  res.status(204).json({ error: "", });
});

// password reset functionalitites
AuthRouter.post(
  "/api/send-password-reset",
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const db: Driver = req.app.locals.driver;

    // Check for email, then see if one ties to a user
    if (!email) {
      res.status(400).json({ error: "Email is required", });
      return;
    }

    // make sure there's already a registered user with this login
    const existingUser = await db.userRepository.GetByEmail(email);
    if (existingUser == null) {
      // no user found
      res.json({ error: "No user with this email.", });
      return;
    }

    // make a random 6 digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const stringCode = verificationCode.toString(); // turn to string

    // New verification parameters TODO make sure this is valid
    existingUser.verification = {
      code: stringCode,
      newUser: false,
      expires: Date.now() + 15 * 60 * 1000 // expires in 15 mins
    };

    // Email
    if (req.app.locals.transporter) {
      let message = `
        Hey there ${email},<br /><br />

        Here is your password verification code: ${verificationCode}.
        `;
      const info = await req.app.locals.transporter.messages.create(
        process.env.MAILGUN_DOMAIN!,
        {
          from: `Codennect <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: [email],
          subject: "Verify your email",
          html: message,
        }
      );
      console.log("Password reset email sent.", info);
    } else {
      console.info(
        "Mailgun credentials were not specified, verification code:"
      );
      console.info(verificationCode);
    }
    res.json({ error: "", result: "Password reset email sent.", });
  }
);

// actually resets the password itself
AuthRouter.post("/api/change-password", async (req: Request, res: Response) => {
  // This is why we need the code in the database
  const { verificationCode, email, newPassword } = req.body;
  const db: Driver = req.app.locals.driver;

  // Check that the new password is a valid entry
  if (!newPassword) {
    res.status(400).send({ error: "Invalid name or password.", });
    return;
  }

  // Validate token
  const verifyAttempt = await db.userRepository.ValidateVerification(
    verificationCode
  );
  if (!verifyAttempt) {
    res.status(400).send({ error: "Invalid or expired password verification code.", });
    return;
  }

  // change the password
  const user = await db.userRepository.GetByEmail(email);
  if (user == null) {
    res.status(400).send({ error: "User with that email not found.", });
    return;
  }

  // high chance of crashing here ngl
  const updateSuccess = await db.userRepository.UpdatePassword(
    user._id,
    newPassword
  );
  if (!updateSuccess) {
    res.status(400).send({ error: "Failed to update password.", });
    return;
  }

  await db.userRepository.DeleteVerification(verificationCode);

  // return a successful password change message
  res.status(201).json({ error: "", result: "Password changed successfully!", });
});

export default AuthRouter;
