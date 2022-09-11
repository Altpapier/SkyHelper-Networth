const skyblockItems = require('../constants/items.json');

const calculateSackItem = (item, prices) => {
  const itemPrice = prices[item.id.toLowerCase()] || 0;
  if (itemPrice) {
    return {
      name: skyblockItems.find((skyblockItem) => skyblockItem.id === item.id)?.name || 'Unknown',
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
