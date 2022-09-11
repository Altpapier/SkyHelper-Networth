const skyblockItems = require('./items.json');
const accessories = skyblockItems.filter((item) => item.category === 'ACCESSORY').map((item) => item.id.toLowerCase());

module.exports = {
  accessories,
};
