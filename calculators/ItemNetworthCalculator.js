const { parsePrices } = require('../helper/prices');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const networthManager = require('./NetworthManager');
const ItemNetworthHelper = require('./ItemNetworthHelper');
const HotPotatoBookHandler = require('./handlers/HotPotatoBook');
const RecombobulatorHandler = require('./handlers/Recombobulator');
const PickonimbusHandler = require('./handlers/Pickonimbus');

class ItemNetworthCalculator extends ItemNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;

        this.#validateItem();

        this.itemName = this.itemData.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '');
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.extraAttributes = this.itemData.tag.ExtraAttributes ?? {};
        this.itemLore = this.itemData.tag.display.Lore ?? [];
        this.itemId = this.extraAttributes.id;
        this.baseItemId = this.itemId;

        this.calculation = [];
        this.price = 0;
        this.base = 0;
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
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, false, includeItemData ?? networthManager.includeItemData);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, true, includeItemData ?? networthManager.includeItemData);
    }

    #getBasePrice(prices, nonCosmetic) {
        this.itemName = this.getItemName();
        this.itemId = this.getItemId();

        const itemData = prices[this.itemId] ?? 0;
        this.price = itemData * item.Count;
        this.base = itemData * item.Count;
        if (this.extraAttributes.skin && !nonCosmetic) {
            const newPrice = prices[item.tag.this.itemId.toLowerCase()];
            if (newPrice && newPrice > this.price) {
                this.price = newPrice * item.Count;
                this.base = newPrice * item.Count;
            }
        }

        if (!this.price && this.extraAttributes.price) {
            this.price = parseInt(this.extraAttributes.price) * 0.85;
            this.base = parseInt(this.extraAttributes.price) * 0.85;
        }
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
            name: itemName,
            loreName: itemData.tag.display.Name,
            id: itemId,
            price,
            base,
            calculation,
            count: itemData.Count || 1,
            soulbound: this.isSoulbound(),
        };

        return returnItemData ? { ...data, item: itemData } : data;
    }
}

module.exports = { ItemNetworthCalculator };
