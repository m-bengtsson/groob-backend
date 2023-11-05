import transporter from "../nodemailer.js";

const useSendEmail = async (mailOptions) => {
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			throw new Error("Could not send verification email");
		} else {
			return;
		}
	});
};

export default useSendEmail;
