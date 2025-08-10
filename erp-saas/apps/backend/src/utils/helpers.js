exports.generateTokenHex = (len = 32) => {
  return [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};
