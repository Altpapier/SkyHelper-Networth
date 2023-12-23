const { validRunes } = require('../constants/misc');
const { titleCase } = require('../helper/functions');
const { getHypixelItemInformationFromId } = require("../constants/itemsMap")

const calculateSackItem = (item, prices) => {
  const itemPrice = prices[item.id.toLowerCase()] || 0;
  if (item.id.startsWith('RUNE_') && !validRunes.includes(item.id)) return null;
  const name = item.name || getHypixelItemInformationFromId(item.id)?.name || titleCase(item.id);
  if (itemPrice) {
    return {
      name: name.replace(/§[0-9a-fk-or]/gi, ''),
      id: item.id,
      price: itemPrice * item.amount,
      calculation: [],
      count: item.amount,
      soulbound: false,
    };
  } else {
    return null;
  }
};

module.exports = {
  calculateSackItem,
};
