const networthManager = require('../../managers/NetworthManager');
const ItemNetworthHelper = require('./ItemNetworthHelper');
const HotPotatoBookHandler = require('./handlers/HotPotatoBook');
const RecombobulatorHandler = require('./handlers/Recombobulator');
const PickonimbusHandler = require('./handlers/Pickonimbus');
const { ValidationError } = require('../../helper/errors');

class ItemNetworthCalculator extends ItemNetworthHelper {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData, prices, nonCosmetic) {
        super(itemData, prices, nonCosmetic);

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

    #calculate(prices, nonCosmetic, returnItemData) {
        const handlers = [RecombobulatorHandler, PickonimbusHandler, HotPotatoBookHandler];
        for (const Handler of handlers) {
            const handler = new Handler(this.itemData, prices);
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

        return returnItemData ? { ...data, item: this.itemData } : data;
    }
}

module.exports = ItemNetworthCalculator;
