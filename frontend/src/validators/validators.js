/**
 * @description standard password validator:: compares 2 pass(words)
 * @param {string} pass1 password1
 * @param {string} pass2 password2
 * @param {number} minLength minimum length of the password
 * */
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

/**
 * Extracts the version(M) from a hex UUID
 * xxxxxxxxxxxxMxxxNxxxxxxxxxxxxxxx
 *
 * @param  {string} uuid
 * @return {number}
 */
const getVersion = (uuid) => {
  return uuid.charAt(12) | 0;
};

/**
 * checks if a given uuid is valid
 *
 * @param  {string} uuid
 * @param  {number} version
 * @return {bool}
 */
const isValidUUID = (uuid, version) => {
  if (!uuid) return false;
  let _uuid = uuid.split("-").join("");

  let pattern = /^[0-9a-f]{8}[0-9a-f]{4}[1-5][0-9a-f]{3}[0-9a-f]{4}[0-9a-f]{12}$/i;
  if (!pattern.test(_uuid)) return false;

  if (version === undefined) {
    version = getVersion(_uuid);
    if ([1, 3, 4, 5].indexOf(version) === -1) return false;
  } else if (getVersion(_uuid) !== version) {
    return false;
  }
  switch (version) {
    case 1:
    case 2:
      return true;
    case 3:
    case 4:
    case 5:
      if (["8", "9", "a", "b"].indexOf(_uuid.charAt(16)) === -1) return false;
      return true;
    default:
      return false;
  }
};

export { validatePasswords, isValidUUID };
