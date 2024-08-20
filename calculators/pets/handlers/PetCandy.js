const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const { blockedCandyReducePets } = require('../../../constants/pets');

class PetCandyHandler {
    applies(pet) {
        const maxPetCandyXp = pet.petData.candyUsed * 1000000;
        const xpLessPetCandy = pet.petData.exp - maxPetCandyXp;
        return pet.petData.candyUsed > 0 && !blockedCandyReducePets.includes(pet.petData.type) && xpLessPetCandy >= pet.petData.xpMax;
    }

    calculate(pet) {
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
