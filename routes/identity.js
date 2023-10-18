import express from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../database.js";

const router = express.Router()
const secret_key = process.env.SECRET_KEY;

router.post("/login", async (req, res) => {
   const { email, password } = req.body;
   const user = await getUserByEmail(email);

   if (user.password === password) {
      const accessToken = jwt.sign({ email }, secret_key, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ email }, secret_key, { expiresIn: "1d" });

      res
         .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
         })
         .header("Authorization", accessToken)
         .send(email);
   }
});

router.post("/refresh", async (req, res) => {
   const refreshToken = req.cookies["refreshToken"];

   if (!refreshToken) {
      return res.status(401).send("Neej va synd, du hade ingen refreshtoken :/");
   }
   try {
      const decoded = jwt.verify(refreshToken, secret_key);
      const accessToken = jwt.sign({ email: decoded.email }, secret_key, {
         expiresIn: "15m",
      });
      res.status(200).header("Authorization", accessToken).send(decoded.email);
   } catch (error) {
      res.status(401).send("Neej va synd du får ingen ny token :'(");
   }
});

export default router;
