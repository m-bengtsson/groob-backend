import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import transporter from "../nodemailer.js";
import { validateLogin, validateSignup } from "../middleware/validate.js";
import { isAdmin } from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js"
import db from "../models/index.js";
import { getUserByEmail, createUser } from "../controllers/user.controllers.js";

const router = express.Router();
dotenv.config();

const secret_key_access = process.env.SECRET_KEY_ACCESS;
const secret_key_refresh = process.env.SECRET_KEY_REFRESH;
const secret_key_verify = process.env.SECRET_KEY_VERIFY;

router.post("/invite", [authenticate, isAdmin], async (req, res) => {
   const { email } = req.body;
   const { id } = req.user;

   const maybeUser = await getUserByEmail(email);
   if (maybeUser) {
      return res.status(400).send("Neej va syynd, emailwn används redan :'(");
   }

   const maybeInvited = await db.invitedUser.findOne({ where: { email } });
   if (maybeInvited) {
      await db.invitedUser.destroy({ where: { id: maybeInvited.id } })
   }

   const verificationToken = jwt.sign({ email }, secret_key_verify, {
      expiresIn: "15m",
   });

   await db.invitedUser.create({ id: uuidv4(), email, token: verificationToken, createdBy: id });

   // Todo: token i url
   const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email verification",
      html: '<p>Click <a href="http://localhost:5173/login">here</a> to reset your password</p>',
   };
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         res.status(400).send("Could not send verification email" + error);
      } else {
         res.status(200).send("Email sent: " + verificationToken);
      }
   });
});

router.post("/register", validateSignup, async (req, res) => {
   const { name, password } = req.body;
   const { email, createdBy } = req.invite;

   try {
      const createdUser = await createUser({ name, email, password, createdBy })
      res.status(200).send(createdUser)
   } catch (error) {
      res.status(400).send("Something went wrong")
   }
});



router.post("/login", validateLogin, async (req, res) => {
   const { email, name, id } = req.user;

   const user = { email, name, id };

   const accessToken = jwt.sign(user, secret_key_access, {
      expiresIn: "15m",
   });
   const refreshToken = jwt.sign(user, secret_key_refresh, {
      expiresIn: "1d",
   });

   res
      .cookie("refreshToken", refreshToken, {
         httpOnly: true,
         sameSite: "strict",
      })
      .header("Authorization", accessToken)
      .send(user);
});

router.post("/refresh", async (req, res) => {
   const refreshToken = req.cookies["refreshToken"];

   if (!refreshToken) {
      return res.status(401).send("Neej va synd, du hade ingen refreshtoken :/");
   }
   try {
      const decoded = jwt.verify(refreshToken, secret_key_refresh);
      const accessToken = jwt.sign({ email: decoded.email }, secret_key_access, {
         expiresIn: "15m",
      });
      res.status(200).header("Authorization", accessToken).send(decoded.email);
   } catch (error) {
      res.status(401).send("Neej va synd du får ingen ny token :'(");
   }
});

export default router;
