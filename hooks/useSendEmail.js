import transporter from "../nodemailer.js";

const useSendEmail = async (mailOptions, errorCallback) => {
	try {
		await transporter.sendMail(mailOptions);
		return;
	} catch (error) {
		errorCallback();
	}
};

export default useSendEmail;
