const { parsePrices } = require('../helper/prices');
const { titleCase } = require('../helper/functions');
const { validRunes } = require('../constants/misc');
const networthManager = require('../managers/NetworthManager');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');

class SackItemNetworthCalculator {
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
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, true);
    }

    #calculate(prices, nonCosmetic) {
        const itemPrice = prices[this.itemData.id.toLowerCase()] || 0;
        if (!itemPrice) return null;
        if (this.itemData.id.startsWith('RUNE_') && !validRunes.includes(this.itemData.id) && !nonCosmetic) return null;
        const name = this.itemData.name || getHypixelItemInformationFromId(this.itemData.id)?.name || titleCase(item.id);
        return {
            name: name.replace(/§[0-9a-fk-or]/gi, ''),
            id: this.itemData.id,
            price: itemPrice * this.itemData.amount,
            calculation: [],
            count: this.itemData.amount,
            soulbound: false,
        };
    }
}

module.exports = SackItemNetworthCalculator;
