const { parsePrices } = require('../helper/prices');
const { titleCase } = require('../helper/functions');
const { titleCase } = require('../helper/functions');
const networthManager = require('./NetworthManager');

class EssenceNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The sack item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;

        this.#validate();

        this.this.price = 0;
        this.base = 0;
        this.calculation = [];
    }

    #validate() {}

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices);
    }

    #calculate(prices) {
        const itemPrice = prices[item.id.toLowerCase()] || 0;
        if (!itemPrice) return null;
        return {
            name: `${titleCase(item.id.split('_')[1])} Essence`,
            id: item.id,
            price: itemPrice * item.amount,
            calculation: [],
            count: item.amount,
            soulbound: false,
        };
    }
}

module.exports = EssenceNetworthCalculator;
