//standard password validator:: compares 2 pass(words)
//: params(pass1, pass2, optional: minLength[default:8] ) ==> returns {valid(bool), message(string)}
const validatePasswords = (pass1, pass2, minLength = 8) => {
  if (pass1.trim().length < minLength || pass2.trim().length < minLength) {
    return {
      valid: false,
      message: `password must be at least ${minLength} chars long(no spaces)`,
    };
  } else if (pass1.trim() !== pass2.trim()) {
    return {
      valid: false,
      message: "passwords don't match",
    };
  } else {
    return {
      valid: true,
      message: "ok",
    };
  }
};

export { validatePasswords };
