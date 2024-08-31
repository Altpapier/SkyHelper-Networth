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
        return pet.petData.candyUsed > 0 && !blockedCandyReducePets.includes(pet.petData.type) && xpLessPetCandy >= pet.petData.xpMax;
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(pet, prices) {
        const reducedValue = pet.price * APPLICATION_WORTH.petCandy;

        if (!isNaN(pet.price)) {
            if (pet.petData.level === 100) {
                pet.price = Math.max(reducedValue, pet.price - 5000000);
            } else {
                pet.price = Math.max(reducedValue, pet.price - 2500000);
            }
        }
    }
}

module.exports = PetCandyHandler;
