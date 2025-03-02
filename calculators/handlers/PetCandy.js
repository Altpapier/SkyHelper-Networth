const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { BLOCKED_CANDY_REDUCE_PETS } = require('../../constants/pets');

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
        const maxPetCandyXp = (pet.petData.candyUsed ?? 0) * 1000000;
        const xpLessPetCandy = (pet.petData.exp ?? 0) - maxPetCandyXp;
        return pet.petData.candyUsed > 0 && !BLOCKED_CANDY_REDUCE_PETS.includes(pet.petData.type) && xpLessPetCandy < pet.level.xpMax;
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     */
    calculate(pet) {
        let reduceValue = pet.basePrice * (1 - APPLICATION_WORTH.petCandy);
        const maxReduction = pet.level.level === 100 ? 5000000 : 2500000;
        reduceValue = Math.min(reduceValue, maxReduction);

        const calculationData = {
            id: 'CANDY',
            type: 'PET_CANDY',
            price: -reduceValue,
            count: pet.petData.candyUsed,
        };
        pet.calculation.push(calculationData);
        pet.price += calculationData.price;
    }
}

module.exports = PetCandyHandler;
