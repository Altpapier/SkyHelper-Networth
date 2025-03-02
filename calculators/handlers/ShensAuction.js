const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the price paid in shens auctions.
 */
class ShensAuctionHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.price !== undefined && item.extraAttributes.auction !== undefined && item.extraAttributes.bid !== undefined;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     */
    calculate(item) {
        const pricePaid = Number(item.extraAttributes.price) * APPLICATION_WORTH.shensAuctionPrice;
        if (pricePaid > item.basePrice) {
            item.basePrice = pricePaid;
            item.calculation.push({
                id: item.itemId,
                type: 'SHENS_AUCTION',
                price: pricePaid,
                count: 1,
            });
        }
    }
}

module.exports = ShensAuctionHandler;
