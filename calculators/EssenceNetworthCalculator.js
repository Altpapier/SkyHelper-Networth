const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const { titleCase } = require('../helper/functions');

class EssenceNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The sack item the networth should be calculated for
     */
    constructor(itemData, prices) {
        this.itemData = itemData;
        this.itemId = itemData.id;
        this.itemName = titleCase(this.itemId);
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.prices = prices;
        
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
    async getNetworth() {
        return this.#calculate();
    }

    #calculate() {
        const itemPrice = this.prices[this.itemId] || 0;
        if (!itemPrice) {
            return null;
        }

        return {
            name: this.itemName.split(' ').reverse().join(' '),
            id: this.itemId,
            price: itemPrice * this.itemData.amount,
            calculation: [],
            count: this.itemData.amount,
            soulbound: false,
        };
    }
}

module.exports = EssenceNetworthCalculator;
