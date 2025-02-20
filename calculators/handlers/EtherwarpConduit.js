const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Etherwarp Conduit modifier on an item.
 */
class EtherwarpConduitHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.ethermerge;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'ETHERWARP_CONDUIT',
            type: 'ETHERWARP_CONDUIT',
            price: (prices['ETHERWARP_CONDUIT'] ?? 0) * APPLICATION_WORTH.etherwarp,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = EtherwarpConduitHandler;
