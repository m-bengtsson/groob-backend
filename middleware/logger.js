const logger = (req, res, next) => {
	console.log("LOG Path: ", req.path);
	console.log("LOG Method: ", req.method);
	console.log("LOG Url: ", req.url);
	console.log("LOG IP:", req.ip);
	console.log("LOG Headers", req.headers);
	console.log("LOG Cookies", req.cookies);

	next();
};

export default logger;
