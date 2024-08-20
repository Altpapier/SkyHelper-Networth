const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const { blockedCandyReducePets } = require('../../../constants/pets');
const PetCalculationHandler = require('../PetCalculationHandler');

class PetCandyHandler extends PetCalculationHandler {
    constructor(data) {
        super(data);
    }

    applies() {
        const maxPetCandyXp = this.petData.candyUsed * 1000000;
        const xpLessPetCandy = this.petData.exp - maxPetCandyXp;
        return this.petData.candyUsed > 0 && !blockedCandyReducePets.includes(this.petData.type) && xpLessPetCandy >= this.petData.xpMax;
    }

    calculate() {
        const reducedValue = this.price * APPLICATION_WORTH.petCandy;

        if (!isNaN(this.price)) {
            if (this.petData.level === 100) {
                this.price = Math.max(reducedValue, this.price - 5000000);
            } else {
                this.price = Math.max(reducedValue, this.price - 2500000);
            }
        }
    }
}

module.exports = PetCandyHandler;
