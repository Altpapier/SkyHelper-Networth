const { titleCase } = require('../helper/functions');

const calculateEssence = (item, prices) => {
  const itemPrice = prices[item.id.toLowerCase()] || 0;

  if (itemPrice) {
    return {
      name: `${titleCase(item.id.split('_')[1])} Essence`,
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
  calculateEssence,
};
