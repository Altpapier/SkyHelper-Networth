const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the price paid in the Dark Auction for Midas weapons.
 */
class MidasWeaponHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId === 'MIDAS_STAFF' || item.itemId === 'MIDAS_SWORD';
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const maxBid = item.itemId === 'MIDAS_SWORD' ? 50_000_000 : 100_000_000;
        const type = item.itemId === 'MIDAS_SWORD' ? 'MIDAS_SWORD_50M' : 'MIDAS_STAFF_100M';

        // If max price paid
        if (item.extraAttributes.winning_bid >= maxBid) {
            const calculationData = {
                id: item.itemId,
                type: type,
                price: prices[type] || item.price,
                count: 1,
            };
            item.price = calculationData.price;
            item.calculation.push(calculationData);
        } else {
            // Else use winning bid amount
            const calculationData = {
                id: item.itemId,
                type: 'WINNING_BID',
                price: item.extraAttributes.winning_bid * APPLICATION_WORTH.winningBid,
                count: 1,
            };
            item.price = calculationData.price;
            item.calculation.push(calculationData);
        }
    }
}

module.exports = MidasWeaponHandler;
