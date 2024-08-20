const { PICKONIMBUS_DURABILITY } = require('../../../constants/misc');
const ItemNetworthHelper = require('../ItemNetworthHelper');

class PickonimbusHandler extends ItemNetworthHelper {
    constructor(itemData, prices) {
        super(itemData, prices);
    }

    applies() {
        return this.itemId === 'PICKONIMBUS' && this.itemData.tag.ExtraAttributes.pickonimbus_durability;
    }

    calculate() {
        const reduction = this.itemData.tag.ExtraAttributes.pickonimbus_durability / PICKONIMBUS_DURABILITY;

        this.price += this.price * (reduction - 1);
        this.base += this.price * (reduction - 1);
    }
}

module.exports = PickonimbusHandler;
