const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Pet Candy modifier on a pet
 */
class PetItemHandler {
    /**
     * Checks if the handler applies to the pet
     * @param {object} pet The pet data
     * @returns {boolean} Whether the handler applies to the pet
     */
    applies(pet) {
        return Boolean(pet.petData.heldItem);
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(pet, prices) {
        const calculationData = {
            id: pet.petData.heldItem,
            type: 'PET_ITEM',
            price: (prices[pet.petData.heldItem] ?? 0) * APPLICATION_WORTH.petItem,
            count: 1,
        };

        pet.calculation.push(calculationData);
        pet.price += calculationData.price;
    }
}

module.exports = PetItemHandler;
