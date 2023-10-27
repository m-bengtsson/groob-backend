import transporter from "../nodemailer.js";

const useSendEmail = async (mailOptions) => {
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.status(400).send("Could not send verification email" + error);
		} else {
			return;
		}
	});
};

export default useSendEmail;
