import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";
import { useGetUser } from "../hooks/useUser.js";

dotenv.config();
const secret_key_access = process.env.SECRET_KEY_ACCESS;
const secret_key_refresh = process.env.SECRET_KEY_REFRESH;
const Refreshtoken = db.refreshToken;

const authenticate = async (req, res, next) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, secret_key_access);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const maybeTokenExists = await Refreshtoken.findOne({
        where: { token: refreshToken },
      });

      if (maybeTokenExists) {
        const decoded = jwt.verify(refreshToken, secret_key_refresh);

        const user = await useGetUser(decoded.id);

        const accessToken = jwt.sign(user.dataValues, secret_key_access, {
          expiresIn: "15m",
        });

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("Authorization", accessToken)
          .send(user.dataValues);
      }
    } catch (error) {
      console.log("BACKEND ERROR", error);
      return res.status(401).send("Invalid Token.");
    }
  }
};

export default authenticate;
