/**
 * A handler for the attribute roll on an item.
 */
class AttributeRollHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId !== 'ATTRIBUTE_SHARD' && Object.keys(item.extraAttributes.attributes ?? {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const sortedAttributes = Object.keys(item.extraAttributes.attributes).sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));
        const formattedId = item.itemId.replace(/(HOT_|FIERY_|BURNING_|INFERNAL_)/g, '');
        const attributeRollId = `${formattedId}${sortedAttributes.map((attribute) => `_ROLL_${attribute.toUpperCase()}`).join('')}`;
        const attributeRollPrice = prices[attributeRollId];
        if (attributeRollPrice > item.price) {
            item.price = attributeRollPrice;
            item.base = attributeRollPrice;
            item.calculation.push({
                id: attributeRollId.slice(formattedId.length + 1),
                type: 'ATTRIBUTE_ROLL',
                price: attributeRollPrice,
                count: 1,
            });
        }
    }
}

module.exports = AttributeRollHandler;
