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
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the pets's networth calculation
     */
    async getNetworth({ prices, cachePrices, pricesRetries } = {}) {
        return await this.#calculate({ prices, nonCosmetic: false, cachePrices, pricesRetries });
    }

    /**
     * Returns the non-cosmetic networth of a pet
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the pet's networth calculation
     */
    async getNonCosmeticNetworth({ prices, cachePrices, pricesRetries } = {}) {
        return await this.#calculate({ prices, nonCosmetic: true, cachePrices, pricesRetries });
    }

    /**
     * Calculates the networth of a pet
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.nonCosmetic] Whether to calculate the non-cosmetic networth
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns An object containing the pet's networth calculation
     */
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, cachePricesTime }) {
        // Set default values
        this.nonCosmetic = nonCosmetic;
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
        }

        // Get the base price
        this.getBasePrice(prices);
        this.price = 0;
        this.calculation = [];

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
            id: this.petData.type,
            customId: this.getPetId(prices, this.nonCosmetic),
            name: this.petName,
            price: this.price + this.basePrice,
            basePrice: this.basePrice,
            calculation: this.calculation,
            soulbound: this.isSoulbound(),
            cosmetic: this.isCosmetic(),
            petData: this.petData,
        };
    }
}

module.exports = PetNetworthCalculator;
