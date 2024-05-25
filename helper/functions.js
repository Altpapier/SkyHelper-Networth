const { parse, simplify } = require('prismarine-nbt');

function titleCase(str) {
  let splitStr = str.toLowerCase().replace(/_/g, ' ').split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    if (!splitStr[i][0]) continue;
    splitStr[i] = splitStr[i][0].toUpperCase() + splitStr[i].substr(1);
  }
  str = splitStr.join(' ');
  return str;
}

const decodeData = async (data) => {
  const parsedNbt = await parse(Buffer.from(data, 'base64'));
  const simplifiedNbt = simplify(parsedNbt.parsed);
  return simplifiedNbt.i;
};

module.exports = {
  titleCase,
  decodeData,
};
