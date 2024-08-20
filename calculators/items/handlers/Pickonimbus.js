const { PICKONIMBUS_DURABILITY } = require('../../../constants/misc');

class PickonimbusHandler {
    static applies(item) {
        return item.itemId === 'PICKONIMBUS' && item.itemData.ExtraAttributes.pickonimbus_durability;
    }

    static calculate({ itemData, price, base }) {
        const reduction = itemData.tag.ExtraAttributes.pickonimbus_durability / PICKONIMBUS_DURABILITY;
        price += price * (reduction - 1);
        base += price * (reduction - 1);
    }
}

module.exports = PickonimbusHandler;
