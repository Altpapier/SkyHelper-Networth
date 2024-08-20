const PetCandyHandler = require('./handlers/PetCandy');
const PetItemHandler = require('./handlers/PetItem');
const SoulboundPetSkinHandler = require('./handlers/SoulboundPetSkin');
const PetNetworthHelper = require('./PetNetworthHelper');

class PetNetworthCalculator extends PetNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} petData The pet the networth should be calculated for
     */
    constructor(petData, prices, nonCosmetic) {
        super(petData, prices, nonCosmetic);

        // this.#validate();
    }

    // #validate() {
    //
    // }

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth() {
        return this.#calculate();
    }

    #calculate() {
        const handlers = [SoulboundPetSkinHandler, PetItemHandler, PetCandyHandler];
        for (const Handler of handlers) {
            const handler = new Handler(this.petData, this.prices);
            if (handler.applies() === false) {
                continue;
            }

            handler.calculate();
        }

        return {
            ...this.petData,
            id: this.petId,
            price: this.price,
            base: this.base,
            calculation: this.calculation,
            soulbound: this.isSoulbound(),
            cosmetic: !!this.skin,
        };
    }
}

module.exports = PetNetworthCalculator;
