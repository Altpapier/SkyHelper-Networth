const { getPrices } = require('../helper/prices');
const networthManager = require('../managers/NetworthManager');
const PetCandyHandler = require('./handlers/PetCandy');
const PetItemHandler = require('./handlers/PetItem');
const SoulboundPetSkinHandler = require('./handlers/SoulboundPetSkin');
const PetNetworthHelper = require('./helpers/PetNetworthHelper');

class PetNetworthCalculator extends PetNetworthHelper {
    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries }) {
        return await this.#calculate(prices, false, { cachePrices, pricesRetries });
    }

    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries }) {
        return await this.#calculate(prices, true, { cachePrices, pricesRetries });
    }

    async #calculate(prices, nonCosmetic, { cachePrices, pricesRetries }) {
        this.nonCosmetic = nonCosmetic;
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;

        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        this.petId = this.getPetId(prices);
        this.getBasePrice(prices);

        const handlers = [PetCandyHandler, PetItemHandler, SoulboundPetSkinHandler];
        for (const Handler of handlers) {
            const handler = new Handler();
            if (handler.applies(this) === false) {
                continue;
            }

            handler.calculate(this, prices);
        }

        return {
            ...this.petData,
            id: this.petId,
            price: this.price + this.calculation.reduce((acc, curr) => acc + curr.price, 0),
            base: this.base,
            calculation: this.calculation,
            soulbound: this.isSoulbound(),
            cosmetic: !!this.skin,
        };
    }
}

module.exports = PetNetworthCalculator;
