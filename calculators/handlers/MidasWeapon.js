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
        return ['MIDAS_SWORD', 'STARRED_MIDAS_SWORD', 'MIDAS_STAFF', 'STARRED_MIDAS_STAFF'].includes(item.itemId);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        let maxBid, type;
        if (item.itemId === 'midas_sword') {
            maxBid = 50_000_000;
            type = 'midas_sword_50m';
        } else if (item.itemId === 'starred_midas_sword') {
            maxBid = 250_000_000;
            type = 'starred_midas_sword_250m';
        } else if (item.itemId === 'midas_staff') {
            maxBid = 100_000_000;
            type = 'midas_staff_100m';
        } else if (item.itemId === 'starred_midas_staff') {
            maxBid = 500_000_000;
            type = 'starred_midas_staff_500m';
        }

        // If max price paid
        if (item.extraAttributes.winning_bid + (item.extraAttributes.additional_coins ?? 0) >= maxBid) {
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

            if (item.extraAttributes.additional_coins) {
                const calculationData = {
                    id: item.itemId,
                    type: 'ADDITIONAL_COINS',
                    price: item.extraAttributes.additional_coins * APPLICATION_WORTH.winningBid,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = MidasWeaponHandler;
