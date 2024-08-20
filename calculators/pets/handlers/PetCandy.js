const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const { blockedCandyReducePets } = require('../../../constants/pets');

class PetCandyHandler {
    static applies({ petData }) {
        const maxPetCandyXp = petData.candyUsed * 1000000;
        const xpLessPetCandy = petData.exp - maxPetCandyXp;
        return petData.candyUsed > 0 && !blockedCandyReducePets.includes(petData.type) && xpLessPetCandy >= petData.xpMax;
    }

    static calculate({ petData, price }, prices) {
        const reducedValue = this.price * APPLICATION_WORTH.petCandy;

        if (!isNaN(price)) {
            if (petData.level === 100) {
                price = Math.max(reducedValue, price - 5000000);
            } else {
                price = Math.max(reducedValue, price - 2500000);
            }
        }
    }
}

module.exports = PetCandyHandler;
