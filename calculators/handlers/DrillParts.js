const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

const drillPartTypes = ['drill_part_upgrade_module', 'drill_part_fuel_tank', 'drill_part_engine'];

/**
 * A handler for Drill parts on a drill.
 */
class DrillPartsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return drillPartTypes.some((type) => Object.keys(item.extraAttributes).includes(type));
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (const type of drillPartTypes) {
            if (item.extraAttributes[type]) {
                const calculationData = {
                    id: item.extraAttributes[type].toUpperCase(),
                    type: 'DRILL_PART',
                    price: (prices[item.extraAttributes[type].toUpperCase()] ?? 0) * APPLICATION_WORTH.drillPart,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = DrillPartsHandler;
