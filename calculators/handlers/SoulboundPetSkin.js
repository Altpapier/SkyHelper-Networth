const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

class SoulboundPetSkinHandler {
    applies(pet) {
        return pet.petData.skin && pet.isSoulbound() && !pet.nonCosmetic;
    }

    calculate(pet, prices) {
        if (!prices[`PET_SKIN_${pet.skin}`]) {
            return;
        }

        const calculationData = {
            id: pet.skin,
            type: 'SOULBOUND_PET_SKIN',
            price: (prices[`PET_SKIN_${pet.skin}`] || 0) * APPLICATION_WORTH.soulboundPetSkins,
            count: 1,
        };

        pet.price += calculationData.price;
        pet.calculation.push(calculationData);
    }
}

module.exports = SoulboundPetSkinHandler;
