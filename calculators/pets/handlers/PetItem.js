const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');

class PetItemHandler {
    static applies({ petData }) {
        return !!petData.heldItem;
    }

    static calculate({ petData, price, calculation }, prices) {
        const calculationData = {
            id: petData.heldItem,
            type: 'pet_item',
            price: (prices[petData.heldItem] || 0) * APPLICATION_WORTH.petItem,
            count: 1,
        };

        calculation.push(calculationData);
        price += calculationData.price;
    }
}

module.exports = PetItemHandler;
