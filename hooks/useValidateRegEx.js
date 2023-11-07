export const usePassWordValidate = async (password, repeatPassword) => {
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

export const useEmailValidate = (email) => {
  const validEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!validEmail.test(email)) {
    throw new Error("Invalid email");
  }
  return;
};
