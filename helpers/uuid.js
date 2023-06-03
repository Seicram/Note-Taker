module.exports = (length = 4) => {
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 16);
    randomString += randomDigit.toString(16);
  }

  return randomString;
};

