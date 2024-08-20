const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const PetNetworthHelper = require('../PetNetworthHelper');

class PetItemHandler extends PetNetworthHelper {
    constructor(petData, prices) {
        super(petData, prices);
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
