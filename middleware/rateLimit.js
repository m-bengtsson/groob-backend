import { rateLimit } from "express-rate-limit";

let failedAttempts = {};

export const setFailedAttempts = () => {
  failedAttempts = {};
};

export const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: (req) => {
    const ip = req.ip;

    console.log("FAILED ATTEMPTS: ", failedAttempts);
    if (failedAttempts[ip] >= 9) {
      return 0;
    }
    return 3;
  },
  handler: (req, res, next) => {
    const ip = req.ip;
    failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;

    if (failedAttempts[ip] >= 9) {
      return res.status(429).send("Reset password please");
    }
    return res.status(429).send("Too many requests, please try again later.");
  },
});
