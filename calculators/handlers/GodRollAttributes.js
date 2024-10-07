/**
 * A handler for god roll attributes on an item.
 */
class GodRollAttributesHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId !== 'ATTRIBUTE_SHARD' && item.extraAttributes.attributes;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const sortedAttributes = Object.keys(item.extraAttributes.attributes).sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));
        const formattedId = item.itemId.replace(/(HOT_|FIERY_|BURNING_|INFERNAL_)/g, '');
        const godRollId = `${formattedId}${sortedAttributes.map((attribute) => `_ROLL_${attribute.toUpperCase()}`).join('')}`;
        const godRollPrice = prices[godRollId];
        if (godRollPrice > item.price) {
            item.price = godRollPrice;
            item.base = godRollPrice;
            item.calculation.push({
                id: godRollId.slice(formattedId.length + 1),
                type: 'GOD_ROLL',
                price: godRollPrice,
                count: 1,
            });
        }
    }
}

module.exports = GodRollAttributesHandler;
