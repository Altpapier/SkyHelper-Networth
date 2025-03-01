const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Soulbound Pet Skin modifier on a pet
 */
class SoulboundPetSkinHandler {
    /**
     * Checks if the handler applies to the pet
     * @param {object} pet The pet data
     * @returns {boolean} Whether the handler applies to the pet
     */
    applies(pet) {
        return Boolean(pet.petData.skin) && pet.isSoulbound() && !pet.nonCosmetic;
    }

    /**
     * Calculates and adds the price of the modifier to the pet
     * @param {object} pet The pet data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(pet, prices) {
        if (!prices[`PET_SKIN_${pet.skin}`]) {
            return;
        }

        const calculationData = {
            id: pet.skin,
            type: 'SOULBOUND_PET_SKIN',
            price: (prices[`PET_SKIN_${pet.skin}`] ?? 0) * APPLICATION_WORTH.soulboundPetSkins,
            count: 1,
        };

        pet.price += calculationData.price;
        pet.calculation.push(calculationData);
    }
}

module.exports = SoulboundPetSkinHandler;
