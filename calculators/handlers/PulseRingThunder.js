const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Thunder In A Bottle modifier on a Pulse Ring.
 */
class PulseRingThunderHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return (item.itemId === 'PULSE_RING') & item.extraAttributes.thunder_charge;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const thunderUpgrades = Math.floor(item.extraAttributes.thunder_charge / 50_000);
        const calculationData = {
            id: 'THUNDER_IN_A_BOTTLE',
            type: 'THUNDER_CHARGE',
            price: (prices['THUNDER_IN_A_BOTTLE'] || 0) * thunderUpgrades * APPLICATION_WORTH.thunderInABottle,
            count: thunderUpgrades,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = PulseRingThunderHandler;
