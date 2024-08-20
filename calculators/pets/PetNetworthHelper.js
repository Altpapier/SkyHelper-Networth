const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { tiers, soulboundPets, getPetLevel } = require('../../constants/pets');
const { titleCase } = require('../../helper/functions');

class PetNetworthHelper {
    constructor(petData, prices) {
        this.prices = prices;
        this.petData = petData;
        this.tier = this.getTier();
        this.skin = this.petData.skin;
        this.basePetId = this.petData.type;
        this.baseTierName = `${this.tier}_${this.basePetId}`;
        this.petId = this.getPetId().toLowerCase();
        this.tierName = this.getTierName();
        this.level = this.getPetLevel();
        // TODO: fix petName (this.petData.level is undefined)
        this.petName = `[Lvl ${this.petData.level}] ${titleCase(`${this.petData.tier} ${this.petData.type}`)}${this.petData.skin ? ' ✦' : ''}`;

        this.calculation = [];
        this.price = 0;
        this.base = 0;

        this.getBasePrice();
    }

    getPetId() {
        if (this.skin && !this.nonCosmetic) {
            const itemId = `${this.tier}_${this.basePetId}${this.skin ? `_SKINNED_${this.skin}` : ''}`;
            if (this.prices[itemId]) {
                return itemId;
            }
        }

        return `${this.tier}_${this.basePetId}`;
    }

    getTierName() {
        return `${this.tier}_${this.petId}`;
    }

    getTier() {
        return this.petData.heldItem === 'PET_ITEM_TIER_BOOST' ? tiers[tiers.indexOf(this.petData.tier) - 1] : this.petData.tier;
    }

    isCosmetic() {
        const testId = (this.itemId + this.itemName).toLowerCase();
        const isSkinOrDye = testId.includes('dye') || testId.includes('skin');
        const isCosmetic = this.skyblockItem.category === 'COSMETIC' || this.itemLore.at(-1)?.includes('COSMETIC');

        return isCosmetic || isSkinOrDye || this.isRune();
    }

    isSoulbound() {
        return soulboundPets.includes(this.petData.type);
    }

    getPetLevelPrices() {
        const basePrices = {
            LVL_1: this.prices[`LVL_1_${this.baseTierName}`.toLowerCase()] || 0,
            LVL_100: this.prices[`LVL_100_${this.baseTierName}`.toLowerCase()] || 0,
            LVL_200: this.prices[`LVL_200_${this.baseTierName}`.toLowerCase()] || 0,
        };

        if (this.skin && !this.nonCosmetic) {
            return {
                LVL_1: Math.max(this.prices[`LVL_1_${this.tierName}`.toLowerCase()] || 0, basePrices.LVL_1),
                LVL_100: Math.max(this.prices[`LVL_100_${this.tierName}`.toLowerCase()] || 0, basePrices.LVL_100),
                LVL_200: Math.max(this.prices[`LVL_200_${this.tierName}`.toLowerCase()] || 0, basePrices.LVL_200),
            };
        }

        return basePrices;
    }

    getBasePrice(prices, nonCosmetic) {
        const { LVL_1, LVL_100, LVL_200 } = this.getPetLevelPrices(prices, nonCosmetic);
        if (LVL_1 === undefined || LVL_100 === undefined) {
            return null;
        }

        this.price = LVL_200 || LVL_100;

        // BASE
        if (this.level.level < 100 && this.level.xpMax) {
            const baseFormula = (LVL_100 - LVL_1) / this.level.xpMax;

            if (baseFormula) {
                this.price = baseFormula * this.level.xp + LVL_100;
            }
        }

        if (this.level.level > 100 && this.level.level < 200) {
            const level = this.level.level.toString().slice(1);

            if (level !== 1) {
                const baseFormula = (LVL_200 - LVL_100) / 100;

                if (baseFormula) {
                    this.price = baseFormula * level + LVL_100;
                }
            }
        }

        this.base = this.price;
    }

    getPetLevel() {
        // TODO: Move from constants to helper
        return getPetLevel(this.petData);
    }
}

module.exports = PetNetworthHelper;
