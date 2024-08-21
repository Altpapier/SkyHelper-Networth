const { PICKONIMBUS_DURABILITY } = require('../../constants/misc');

class PickonimbusHandler {
    applies(item) {
        return item.itemId === 'PICKONIMBUS' && item.itemData.tag.ExtraAttributes.pickonimbus_durability;
    }

    calculate(item, prices) {
        const reduction = item.itemData.tag.ExtraAttributes.pickonimbus_durability / PICKONIMBUS_DURABILITY;

        const calculationData = {
            id: 'PICKONIMBUS_DURABLITY',
            type: 'PICKONIMBUS',
            price: -(item.price * (reduction - 1)),
            count: PICKONIMBUS_DURABILITY - item.itemData.tag.ExtraAttributes.pickonimbus_durability,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = PickonimbusHandler;
