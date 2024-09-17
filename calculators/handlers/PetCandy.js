const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { blockedCandyReducePets } = require('../../constants/pets');

/**
 * A handler for the Pet Candy modifier on a pet
 */
class PetCandyHandler {
    /**
     * Checks if the handler applies to the pet
     * @param {object} pet The pet data
     * @returns {boolean} Whether the handler applies to the pet
     */
    applies(pet) {
        const maxPetCandyXp = pet.petData.candyUsed * 1000000;
        const xpLessPetCandy = pet.petData.exp - maxPetCandyXp;
        return pet.petData.candyUsed > 0 && !blockedCandyReducePets.includes(pet.petData.type) && xpLessPetCandy < pet.level.xpMax;
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     */
    calculate(pet) {
        const reducedValue = pet.price * APPLICATION_WORTH.petCandy;
        if (!isNaN(pet.price)) {
            const oldPrice = pet.price;
            const petPriceReduction = pet.level.level === 100 ? 5000000 : 2500000;
            pet.price = Math.max(reducedValue, pet.price - petPriceReduction);

            const calculationData = {
                id: 'CANDY',
                type: 'PET_CANDY',
                price: pet.price - oldPrice,
                count: pet.petData.candyUsed,
            };
            pet.calculation.push(calculationData);
        }
    }
}

module.exports = PetCandyHandler;
