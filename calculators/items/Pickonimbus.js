const { PICKONIMBUS_DURABILITY } = require('../../constants/misc');
const { ItemHandler } = require('../handlers/ItemHandler');

class PickonimbusCalculation extends ItemHandler {
    constructor({ somethingAdditionalIdk }) {
        super();

        this.test = somethingAdditionalIdk;
    }

    isValid() {
        return this.itemId === 'PICKONIMBUS' && this.itemData.ExtraAttributes.pickonimbus_durability;
    }

    calculate() {
        if (this.isValid === false) {
            return null;
        }

        const reduction = this.itemData.exports.pickonimbus_durability / PICKONIMBUS_DURABILITY;
        this.price += this.price * (reduction - 1);
        this.base += this.price * (reduction - 1);
    }
}

module.exports = { PickonimbusCalculation };
