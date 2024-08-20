const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const { titleCase } = require('../helper/functions');
const { getPrices } = require('../helper/prices');
const networthManager = require('../managers/NetworthManager');

class SackItemNetworthCalculator {
    /**
     * Creates a new SackItemNetworthCalculator
     * @param {object} itemData The sack item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;
        this.itemId = itemData.id;
        this.itemName = titleCase(this.itemId);
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};

        //this.#validate();
    }

    // #validate() {
    //
    // }

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
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;

        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        const itemPrice = prices[this.itemData.id] || 0;
        if (!itemPrice) {
            return null;
        }

        return {
            name: this.itemName,
            id: this.itemId,
            price: itemPrice * this.itemData.amount,
            calculation: [],
            count: this.itemData.amount,
            soulbound: false,
        };
    }
}

module.exports = SackItemNetworthCalculator;
