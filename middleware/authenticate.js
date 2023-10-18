import jwt from "jsonwebtoken";
import dotenv from "dotenv"


dotenv.config();
const secret_key = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
   const accessToken = req.headers["authorization"];
   const refreshToken = req.cookies["refreshToken"];

   if (!accessToken && !refreshToken) {
      return res.status(401).send("Access Denied. No token provided.");
   }
   try {
      const decoded = jwt.verify(accessToken, secret_key);
      req.email = decoded.email;
      next();
   } catch (error) {
      if (!refreshToken) {
         return res.status(401).send("Access Denied. No refresh token provided.");
      }

      try {
         const decoded = jwt.verify(refreshToken, secret_key);
         const accessToken = jwt.sign({ email: decoded.email }, secret_key, {
            expiresIn: "15m",
         });

         res
            .cookie("refreshToken", refreshToken, {
               httpOnly: true,
               sameSite: "strict",
            })
            .header("Authorization", accessToken)
            .send(decoded.email);
      } catch (error) {
         return res.status(400).send("Invalid Token.");
      }
   }
};

export default authenticate;
