const { parsePrices } = require('../../helper/prices');
const { titleCase } = require('../../helper/functions');
const networthManager = require('../../managers/NetworthManager');

class EssenceNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The sack item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;

        this.#validate();

        this.price = 0;
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
        await networthManager.itemsPromise;
        return this.#calculate(prices);
    }

    #calculate(prices) {
        const itemPrice = prices[this.itemData.id.toLowerCase()] || 0;
        if (!itemPrice) return null;
        return {
            name: `${titleCase(this.itemData.id.split('_')[1])} Essence`,
            id: this.itemData.id,
            price: itemPrice * this.itemData.amount,
            calculation: [],
            count: this.itemData.amount,
            soulbound: false,
        };
    }
}

module.exports = EssenceNetworthCalculator;
