const networthManager = require('../managers/NetworthManager');
const ItemNetworthHelper = require('./helpers/ItemNetworthHelper');
const HotPotatoBookHandler = require('./handlers/HotPotatoBook');
const RecombobulatorHandler = require('./handlers/Recombobulator');
const PickonimbusHandler = require('./handlers/Pickonimbus');
const { ValidationError } = require('../helper/errors');
const { getPrices } = require('../helper/prices');

class ItemNetworthCalculator extends ItemNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData) {
        super(itemData);

        this.#validateItem();
    }

    #validateItem() {
        if (!this.itemData || typeof this.itemData !== 'object') {
            throw new ValidationError('Item must be an object');
        }

        if (this.itemData?.tag === undefined && this.itemData?.exp === undefined) {
            throw new ValidationError('Invalid item provided');
        }
    }

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        return await this.#calculate(prices, false, { cachePrices, pricesRetries, includeItemData });
    }

    /**
     * Returns the non-cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        return await this.#calculate(prices, true, { cachePrices, pricesRetries, includeItemData });
    }

    async #calculate(prices, nonCosmetic, { cachePrices, pricesRetries, includeItemData }) {
        this.nonCosmetic = nonCosmetic;
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;
        includeItemData ??= networthManager.includeItemData;

        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        const handlers = [RecombobulatorHandler, PickonimbusHandler, HotPotatoBookHandler];
        for (const Handler of handlers) {
            const handler = new Handler(this);
            if (handler.applies() === false) {
                continue;
            }

            handler.calculate();
        }

        const data = {
            name: this.itemName,
            loreName: this.itemData.tag.display.Name,
            id: this.itemId,
            price: this.price,
            base: this.base,
            calculation: this.calculation,
            count: this.itemData.Count || 1,
            soulbound: this.isSoulbound(),
        };

        return includeItemData ? { ...data, item: this.itemData } : data;
    }
}

module.exports = ItemNetworthCalculator;
