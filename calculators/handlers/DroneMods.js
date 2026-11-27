const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Drone Mods on a Precursor Drone Pet.
 */
class DroneModsHandler {
    /**
     * Checks if the handler applies to the pet
     * @param {object} pet The pet data
     * @returns {boolean} Whether the handler applies to the pet
     */
    applies(pet) {
        return pet.petData.type === 'PRECURSOR_DRONE' && Object.keys(pet.petData.extra).some((key) => key.endsWith('_mod'));
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(pet, prices) {
        for (const mod in pet.petData.extra) {
            if (mod.endsWith('_mod') && pet.petData.extra[mod]) {
                const itemId = mod.slice(0, -4).toUpperCase();
                if (prices[itemId]) {
                    const calculationData = {
                        id: itemId,
                        type: 'DRONE_MOD',
                        price: prices[itemId] * APPLICATION_WORTH.petItem,
                        count: 1,
                    };
                    pet.price += calculationData.price;
                    pet.calculation.push(calculationData);
                }
            }
        }
    }
}

module.exports = DroneModsHandler;
