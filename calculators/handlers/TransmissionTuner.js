const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Transmission Tuner modifier on an item.
 */
class TransmissionTunerHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.tuned_transmission > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'TRANSMISSION_TUNER',
            type: 'TRANSMISSION_TUNER',
            price: (prices['TRANSMISSION_TUNER'] ?? 0) * item.extraAttributes.tuned_transmission * APPLICATION_WORTH.tunedTransmission,
            count: item.extraAttributes.tuned_transmission,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = TransmissionTunerHandler;
