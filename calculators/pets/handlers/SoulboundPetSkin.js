const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const PetNetworthHelper = require('../PetNetworthHelper');

class SoulboundPetSkinHandler extends PetNetworthHelper {
    constructor(petData, prices) {
        super(petData, prices);
    }

    applies() {
        return this.petData.skin && this.isSoulbound() && !this.nonCosmetic;
    }

    calculate() {
        const calculationData = {
            id: this.skin,
            type: 'soulbound_pet_skin',
            price: (this.prices[`PET_SKIN_${this.skin}`] || 0) * APPLICATION_WORTH.soulboundPetSkins,
            count: 1,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = SoulboundPetSkinHandler;
