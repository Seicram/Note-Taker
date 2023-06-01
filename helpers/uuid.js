module.exports = (length = 4) => {
  let randomHexString = '';
  
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 16);
    randomHexString += randomDigit.toString(16);
  }
  
  return randomHexString;
};
