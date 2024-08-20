const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');

class PetItemHandler  {


    applies(pet) {
        return !!pet.petData.heldItem;
    }

    calculate(pet) {
        const calculationData = {
            id: pet.petData.heldItem,
            type: 'PET_ITEM',
            price: (pet.prices[pet.petData.heldItem] || 0) * APPLICATION_WORTH.petItem,
            count: 1,
        };

        pet.calculation.push(calculationData);
        pet.price += calculationData.price;
    }
}

module.exports = PetItemHandler;
