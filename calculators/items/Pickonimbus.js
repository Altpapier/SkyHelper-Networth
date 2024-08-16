const { PICKONIMBUS_DURABILITY } = require('../../constants/misc');

class PickonimbusCalculation {
    constructor({ calculation, itemData, prices, itemId, price }) {
        this.calculation = calculation;
        this.itemData = itemData;
        this.prices = prices;
        this.itemId = itemId;
        this.price = price;
        // this.calculate();
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
