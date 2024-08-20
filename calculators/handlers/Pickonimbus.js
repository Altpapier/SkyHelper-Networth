const { PICKONIMBUS_DURABILITY } = require('../../constants/misc');

class PickonimbusHandler {
    applies(item) {
        return item.itemId === 'PICKONIMBUS' && item.itemData.ExtraAttributes.pickonimbus_durability;
    }

    calculate(item, prices) {
        const reduction = item.itemData.exports.pickonimbus_durability / PICKONIMBUS_DURABILITY;
        item.price += item.price * (reduction - 1);
        item.base += item.price * (reduction - 1);
    }
}

module.exports = PickonimbusHandler;
