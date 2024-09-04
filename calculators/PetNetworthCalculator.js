const { getPrices } = require('../helper/prices');
const networthManager = require('../managers/NetworthManager');
const PetCandyHandler = require('./handlers/PetCandy');
const PetItemHandler = require('./handlers/PetItem');
const SoulboundPetSkinHandler = require('./handlers/SoulboundPetSkin');
const PetNetworthHelper = require('./helpers/PetNetworthHelper');

/**
 * Class for calculating the networth of a pet
 */
class PetNetworthCalculator extends PetNetworthHelper {
    /**
     * Returns the networth of a pet
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the pets's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries } = {}) {
        return await this.#calculate(prices, { nonCosmetic: false, cachePrices, pricesRetries });
    }

    /**
     * Returns the non-cosmetic networth of a pet
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the pet's networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries } = {}) {
        return await this.#calculate(prices, { nonCosmetic: true, cachePrices, pricesRetries });
    }

    /**
     * Calculates the networth of a pet
     * @param {object} prices A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.nonCosmetic] Whether to calculate the non-cosmetic networth
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns An object containing the pet's networth calculation
     */
    async #calculate(prices, { nonCosmetic, cachePrices, pricesRetries }) {
        // Set default values
        this.nonCosmetic = nonCosmetic;
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        // Get the base price
        this.getBasePrice(prices);

        // For each handler, check if it applies and add the calculation to the total price
        const handlers = [PetItemHandler, SoulboundPetSkinHandler];
        handlers.push(PetCandyHandler); // Must be last
        for (const Handler of handlers) {
            // Create a new instance of the handler
            const handler = new Handler();
            // Check if the handler applies to the pet
            if (handler.applies(this) === false) {
                continue;
            }

            // Calculate the price of this modifier
            handler.calculate(this, prices);
        }

        return {
            id: this.petId,
            price: this.price,
            base: this.base,
            calculation: this.calculation,
            soulbound: this.isSoulbound(),
            cosmetic: !!this.skin,
            petData: this.petData,
        };
    }
}

module.exports = PetNetworthCalculator;
