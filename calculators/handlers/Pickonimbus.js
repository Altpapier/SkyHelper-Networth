const { PICKONIMBUS_DURABILITY } = require('../../constants/misc');

/**
 * A handler for the Pickonimbus modifier on an item
 */
class PickonimbusHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId === 'PICKONIMBUS' && item.itemData.tag.ExtraAttributes.pickonimbus_durability;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item) {
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
