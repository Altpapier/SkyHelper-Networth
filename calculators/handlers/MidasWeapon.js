const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

const MIDAS_SWORDS = {
    MIDAS_SWORD: { maxBid: 50_000_000, type: 'MIDAS_SWORD_50M' },
    STARRED_MIDAS_SWORD: { maxBid: 250_000_000, type: 'STARRED_MIDAS_SWORD_250M' },
    MIDAS_STAFF: { maxBid: 100_000_000, type: 'MIDAS_STAFF_100M' },
    STARRED_MIDAS_STAFF: { maxBid: 500_000_000, type: 'STARRED_MIDAS_STAFF_500M' },
};

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
        return Object.keys(MIDAS_SWORDS).includes(item.itemId);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     * @returns {Array<object>} An array containing the price of the modifier
     */
    calculate(item, prices) {
        const { maxBid, type } = MIDAS_SWORDS[item.itemId];
        const winningBid = item.extraAttributes.winning_bid ?? 0;
        const additionalCoins = item.extraAttributes.additional_coins ?? 0;

        // If max price paid
        if (winningBid + additionalCoins >= maxBid) {
            return [
                {
                    id: item.itemId,
                    type: type,
                    price: prices[type] || item.price,
                    count: 1,
                },
            ];
        } else {
            // Else use winning bid amount
            const calculation = [
                {
                    id: item.itemId,
                    type: 'WINNING_BID',
                    price: winningBid * APPLICATION_WORTH.winningBid,
                    count: 1,
                },
            ];
            // This won't work since the price will also be added in the calculator after its returned...
            item.price = winningBid * APPLICATION_WORTH.winningBid;

            if (additionalCoins) {
                calculation.push({
                    id: item.itemId,
                    type: 'ADDITIONAL_COINS',
                    price: additionalCoins * APPLICATION_WORTH.winningBid,
                    count: 1,
                });
            }
            return [calculation];
        }
    }
}

module.exports = MidasWeaponHandler;
