const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');

class SoulboundPetSkinHandler {
    static applies() {
        return false; // this.petData.skin && this.isSoulbound() && !nonCosmetic;
    }

    static calculate({ skin, price, calculation }, prices) {
        const calculationData = {
            id: skin,
            type: 'soulbound_pet_skin',
            price: (prices[`PET_SKIN_${skin}`] || 0) * APPLICATION_WORTH.soulboundPetSkins,
            count: 1,
        };

        price += calculationData.price;
        calculation.push(calculationData);
    }
}

module.exports = SoulboundPetSkinHandler;
