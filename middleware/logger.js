const logger = (req, res, next) => {
  console.log("LOG Path: ", req.path);
  console.log("LOG Method: ", req.method);
  console.log("LOG Url: ", req.url);
  console.log("LOG IP:", req.ip);
  console.log("LOG res status:", res.statusCode);
  console.log(
    "Rate Limit Headers:",
    res.getHeader("RateLimit-Limit"),
    res.getHeader("RateLimit-Remaining"),
    res.getHeader("RateLimit-Reset")
  );
  next();
};

export default logger;
