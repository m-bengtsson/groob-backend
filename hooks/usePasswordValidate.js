const usePassWordValidate = async (password, repeatPassword) => {
	if (!password || !repeatPassword) {
		throw new Error("All fields required");
	}

	const strongPassword =
		/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	if (!strongPassword.test(password)) {
		throw new Error("Password is too weak");
	}

	if (password !== repeatPassword) {
		throw new Error("Passwords do not match");
	}

	return;
};

export default usePassWordValidate;
