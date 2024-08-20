const { PICKONIMBUS_DURABILITY } = require('../../../constants/misc');
const ItemCalculationHandler = require('../ItemCalculationHandler');

class PickonimbusHandler extends ItemCalculationHandler {
    constructor(data) {
        super(data);
    }

    applies() {
        return this.itemId === 'PICKONIMBUS' && this.itemData.tag.ExtraAttributes.pickonimbus_durability;
    }

    calculate() {
        const reduction = this.itemData.tag.ExtraAttributes.pickonimbus_durability / PICKONIMBUS_DURABILITY;

        const calculationData = {
            id: 'PICKONIMBUS_DURABLITY',
            type: 'pickonimbus',
            price: -(this.price * (reduction - 1)),
            count: PICKONIMBUS_DURABILITY - this.itemData.tag.ExtraAttributes.pickonimbus_durability,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = PickonimbusHandler;
