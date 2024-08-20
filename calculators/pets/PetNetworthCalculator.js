const networthManager = require('../../managers/NetworthManager');
const PetCandyHandler = require('./handlers/PetCandy');
const PetItemHandler = require('./handlers/PetItem');
const SoulboundPetSkinHandler = require('./handlers/SoulboundPetSkin');
const PetNetworthHelper = require('./PetNetworthHelper');

class PetNetworthCalculator extends PetNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} petData The pet the networth should be calculated for
     */
    constructor(petData, prices) {
        super(petData, prices);

        this.#validate();
    }

    #validate() {}

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, true);
    }

    #calculate(prices, nonCosmetic) {
        const handlers = [SoulboundPetSkinHandler, PetItemHandler, PetCandyHandler];
        for (const Handler of handlers) {
            const handler = new Handler(this.petData, prices);
            if (handler.applies(this) === false) {
                continue;
            }

            handler.calculate(this, prices);
        }

        return {
            ...this.petData,
            id: this.petId,
            price: this.price,
            base: this.base,
            calculation: this.calculation,
            soulbound: this.isSoulbound(),
        };
    }
}

module.exports = PetNetworthCalculator;
