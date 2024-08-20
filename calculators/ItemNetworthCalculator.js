const { parsePrices } = require('../helper/prices');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const networthManager = require('../managers/NetworthManager');
const ItemNetworthHelper = require('./ItemNetworthHelper');
const HotPotatoBookHandler = require('./handlers/HotPotatoBook');
const RecombobulatorHandler = require('./handlers/Recombobulator');
const PickonimbusHandler = require('./handlers/Pickonimbus');
const { ValidationError } = require('../helper/errors');

class ItemNetworthCalculator extends ItemNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData, prices) {
        super(itemData, prices);

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
    async getNetworth(prices, { includeItemData }) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, false, includeItemData ?? networthManager.includeItemData);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { includeItemData }) {
        await networthManager.itemsPromise;
        return this.#calculate(prices, true, includeItemData ?? networthManager.includeItemData);
    }

    #getBasePrice(prices, nonCosmetic) {
        this.itemName = this.getItemName();
        this.itemId = this.getItemId();

        const itemPrice = prices[this.itemId] ?? 0;
        this.price = itemPrice * this.itemData.Count;
        this.base = itemPrice * this.itemData.Count;
        if (this.extraAttributes.skin && !nonCosmetic) {
            const newPrice = prices[this.itemData.tag.this.itemId.toLowerCase()];
            if (newPrice && newPrice > this.price) {
                this.price = newPrice * this.itemData.Count;
                this.base = newPrice * this.itemData.Count;
            }
        }

        if (!this.price && this.extraAttributes.price) {
            this.price = parseInt(this.extraAttributes.price) * 0.85;
            this.base = parseInt(this.extraAttributes.price) * 0.85;
        }

        this.prices = null;
    }

    #calculate(prices, nonCosmetic, returnItemData) {
        if (this.isCosmetic() && nonCosmetic) {
            return null;
        }

        this.#getBasePrice(prices, nonCosmetic);

        const handlers = [PickonimbusHandler, HotPotatoBookHandler, RecombobulatorHandler];
        for (const Handler of handlers) {
            if (Handler.applies(this)) Handler.calculate(this, prices);
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

        console.log(data);

        return returnItemData ? { ...data, item: this.itemData } : data;
    }
}

module.exports = ItemNetworthCalculator;
