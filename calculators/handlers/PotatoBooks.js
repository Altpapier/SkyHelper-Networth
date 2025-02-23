const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Potato Books modifier on an item
 */
class HotPotatoBookHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.hot_potato_count > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const potatoBookCount = Number(item.itemData.tag.ExtraAttributes.hot_potato_count);
        const hotPotatoBookCount = Math.min(potatoBookCount, 10);

        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'HOT_POTATO_BOOK',
            price: (prices['HOT_POTATO_BOOK'] ?? 0) * hotPotatoBookCount * APPLICATION_WORTH.hotPotatoBook,
            count: hotPotatoBookCount,
        };

        if (potatoBookCount > 10) {
            const fumingPotatoBookCount = potatoBookCount - 10;

            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'FUMING_POTATO_BOOK',
                price: (prices['FUMING_POTATO_BOOK'] ?? 0) * fumingPotatoBookCount * APPLICATION_WORTH.fumingPotatoBook,
                count: fumingPotatoBookCount,
            };

            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = HotPotatoBookHandler;
