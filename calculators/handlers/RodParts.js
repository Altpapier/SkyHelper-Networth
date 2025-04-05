const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

const ROD_PART_TYPES = ['line', 'hook', 'sinker'];

/**
 * A handler for Rod parts on a rod.
 */
class RodPartsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return ROD_PART_TYPES.some((type) => Object.keys(item.extraAttributes).includes(type));
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (const type of ROD_PART_TYPES) {
            if (item.extraAttributes[type]?.part) {
                const soulbound = Boolean(item.extraAttributes[type].donated_museum);
                const calculationData = {
                    id: item.extraAttributes[type].part.toUpperCase(),
                    type: 'ROD_PART',
                    price: (prices[item.extraAttributes[type].part.toUpperCase()] ?? 0) * APPLICATION_WORTH.rodPart,
                    count: 1,
                    soulbound,
                };
                if (soulbound) item.soulboundPrice += calculationData.price;
                else item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = RodPartsHandler;
