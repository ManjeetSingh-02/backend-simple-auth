function validatePassword(password) {
  if (password.length <= 6) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
}

function validateEmail(email) {
  if (!/[@]/.test(email)) return false;
  return true;
}

export { validatePassword, validateEmail };
