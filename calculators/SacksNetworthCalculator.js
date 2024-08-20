const { parsePrices } = require('../helper/prices');
const { titleCase } = require('../helper/functions');
const { titleCase } = require('../helper/functions');
const { validRunes } = require('../constants/misc');
const networthManager = require('./NetworthManager');

class SacksNetworthCalculator {
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
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, true);
    }

    #calculate(prices, nonCosmetic) {
        const itemPrice = prices[item.id.toLowerCase()] || 0;
        if (!itemPrice) return null;
        if (item.id.startsWith('RUNE_') && !validRunes.includes(item.id) && !nonCosmetic) return null;
        const name = item.name || getHypixelItemInformationFromId(item.id)?.name || titleCase(item.id);
        return {
            name: name.replace(/§[0-9a-fk-or]/gi, ''),
            id: item.id,
            price: itemPrice * item.amount,
            calculation: [],
            count: item.amount,
            soulbound: false,
        };
    }
}

module.exports = SacksNetworthCalculator;
