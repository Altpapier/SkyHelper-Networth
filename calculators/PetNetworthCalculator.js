const { getPrices } = require('../helper/prices');
const networthManager = require('../managers/NetworthManager');
const PetCandyHandler = require('./handlers/PetCandy');
const PetItemHandler = require('./handlers/PetItem');
const SoulboundPetSkinHandler = require('./handlers/SoulboundPetSkin');
const PetNetworthHelper = require('./helpers/PetNetworthHelper');

// Define pet handlers array for faster access
const petHandlers = [
    PetItemHandler,
    SoulboundPetSkinHandler,
    PetCandyHandler, // Must be last
];

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
    async getNetworth(options = {}) {
        return await this.#calculate({ ...options, nonCosmetic: false });
    }

    /**
     * Returns the non-cosmetic networth of a pet
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the pet's networth calculation
     */
    async getNonCosmeticNetworth(options = {}) {
        return await this.#calculate({ ...options, nonCosmetic: true });
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
        this.nonCosmetic = nonCosmetic ?? false;
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();

        if (nonCosmetic && this.isCosmetic()) {
            return;
        }

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
        }

        // Get the base price
        const basePrice = this.getBasePrice(prices, nonCosmetic);
        if (basePrice === null) {
            return null;
        }

        this.price = 0;
        this.calculation = [];

        // For each handler, check if it applies and add the calculation to the total price
        for (const HandlerClass of petHandlers) {
            const handler = new HandlerClass();
            if (handler.applies(this) === false) {
                continue;
            }

            try {
                handler.calculate(this, prices);
            } catch {
                //
            }
        }

        // Include isPet flag for item stakcing
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
            isPet: true,
        };
    }
}

module.exports = PetNetworthCalculator;
