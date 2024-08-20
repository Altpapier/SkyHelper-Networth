const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const PetCalculationHandler = require('../PetCalculationHandler');

class PetItemHandler extends PetCalculationHandler {
    constructor(data) {
        super(data);
    }

    applies() {
        return !!this.petData.heldItem;
    }

    calculate() {
        const calculationData = {
            id: this.petData.heldItem,
            type: 'PET_ITEM',
            price: (this.prices[this.petData.heldItem] || 0) * APPLICATION_WORTH.petItem,
            count: 1,
        };

        this.calculation.push(calculationData);
        this.price += calculationData.price;
    }
}

module.exports = PetItemHandler;
