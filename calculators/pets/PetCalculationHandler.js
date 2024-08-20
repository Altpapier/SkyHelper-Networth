class PetCalculationHandler {
    constructor({ petData, prices, calculation, price }) {
        this.calculation = calculation;
        this.petData = petData;
        this.prices = prices;
        this.price = price;
    }
}

module.exports = PetCalculationHandler;
