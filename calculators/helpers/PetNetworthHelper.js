const { TIERS, SOULBOUND_PETS, SPECIAL_LEVELS, RARITY_OFFSET, LEVELS, CUSTOM_PET_NAMES } = require('../../constants/pets');
const { ValidationError } = require('../../helper/errors');
const { titleCase } = require('../../helper/functions');

/**
 * Base class for calculating the networth of a pet
 */
class PetNetworthHelper {
    /**
     * Creates a new PetNetworthHelper
     * @param {object} petData The pet data containing properties like `type`, `tier`, `exp`, `heldItem`, and `skin`.
     */
    constructor(petData) {
        this.petData = petData;

        // Validate the pet
        this.#validateItem();

        // Extract pet properties
        this.nonCosmetic = false;
        this.skin = this.petData.skin;
        this.basePetId = `${this.getTierName()}_${this.petData.type}`;
        this.petId = `${this.basePetId}${this.skin ? `_SKINNED_${this.skin}` : ''}`;
        this.level = this.getPetLevel();
        this.petName = `[Lvl ${this.level.level}] ${titleCase(`${this.getTierBoostedTierName()} ${CUSTOM_PET_NAMES[this.petData.type] ?? titleCase(this.petData.type)}`)}${
            this.petData.skin ? ' ✦' : ''
        }`;

        // Initialize calculation properties
        this.calculation = [];
        this.basePrice = 0;
        this.price = 0;
    }

    /**
     * Validates that the pet data is correct
     */
    #validateItem() {
        if (!this.petData || typeof this.petData !== 'object') {
            throw new ValidationError('Pet must be an object');
        }

        if (this.petData?.type === undefined || this.petData?.tier === undefined || this.petData?.exp === undefined) {
            throw new ValidationError('Invalid pet provided');
        }
    }

    /**
     * Gets the pet's actual tier
     * @returns {number} The pet's actual tier
     */
    getTier() {
        return TIERS.indexOf(this.petData.tier);
    }

    /**
     * Gets the pet's actual tier name
     * @returns {string} The pet's actual tier name
     */
    getTierName() {
        return this.petData.tier;
    }

    /**
     * Gets the pet's tier boosted tier
     * @returns {number} The pet's tier boosted tier
     */
    getTierBoostedTier() {
        return this.petData.heldItem === 'PET_ITEM_TIER_BOOST' ? this.getTier() + 1 : this.getTier();
    }

    /**
     * Gets the pet's tier boosted tier name
     * @returns {string} The pet's tier boosted tier name
     */
    getTierBoostedTierName() {
        return TIERS[this.getTierBoostedTier()];
    }

    /**
     * Checks if the pet is soulbound
     * @returns {boolean} Whether the pet is soulbound
     */
    isSoulbound() {
        return SOULBOUND_PETS.includes(this.petData.type);
    }

    /**
     * Checks if the pet is cosmetic
     * @returns {boolean} Whether the pet is cosmetic
     */
    isCosmetic() {
        return !!this.skin;
    }

    /**
     * Gets the pet prices at levels 1, 100, and 200 (if applicable)
     * @param {object} prices A prices object generated from the getPrices function
     * @returns {object} The pet prices at levels 1, 100, and 200 (if applicable)
     */
    getPetLevelPrices(prices) {
        // Get the base prices for the pet
        const basePrices = {
            LVL_1: prices[`LVL_1_${this.basePetId}`] ?? 0,
            LVL_100: prices[`LVL_100_${this.basePetId}`] ?? 0,
            LVL_200: prices[`LVL_200_${this.basePetId}`] ?? 0,
        };

        // If the pet has a skin, use the skinned prices
        if (this.skin && !this.nonCosmetic) {
            return {
                LVL_1: Math.max(prices[`LVL_1_${this.petId}`] ?? 0, basePrices.LVL_1),
                LVL_100: Math.max(prices[`LVL_100_${this.petId}`] ?? 0, basePrices.LVL_100),
                LVL_200: Math.max(prices[`LVL_200_${this.petId}`] ?? 0, basePrices.LVL_200),
            };
        }

        return basePrices;
    }

    /**
     * Sets the pet's base price
     * @param {object} prices A prices object generated from the getPrices function
     * @param {boolean} nonCosmetic Whether to calculate the non-cosmetic networth
     */
    getBasePrice(prices, nonCosmetic) {
        // Get the pet prices at levels 1, 100, and 200 (if applicable)
        const { LVL_1, LVL_100, LVL_200 } = this.getPetLevelPrices(prices, nonCosmetic);
        if (LVL_1 === undefined || (LVL_100 === undefined && LVL_200 === undefined)) {
            return null;
        }

        // Calculate the pet's price based on the percentage of the level from 1 to its max level
        this.basePrice = LVL_200 || LVL_100;
        if (this.level.level < 100 && this.level.xpMax) {
            const baseFormula = (LVL_100 - LVL_1) / this.level.xpMax;
            if (baseFormula) {
                this.basePrice = baseFormula * this.level.xp + LVL_1;
            }
        }

        // Calculate the pet's price based on the percentage of the level from 100 to 200
        if (this.level.level > 100 && this.level.level < 200) {
            const level = this.level.level.toString().slice(1);
            if (level !== 1) {
                const baseFormula = (LVL_200 - LVL_100) / 100;
                if (baseFormula) {
                    this.basePrice = baseFormula * level + LVL_100;
                }
            }
        }
    }

    /**
     * Gets the pet id based on the pet's properties
     * @param {object} prices A prices object generated from the getPrices function
     * @param {boolean} nonCosmetic Whether to calculate the non-cosmetic networth
     */
    getPetId(prices, nonCosmetic) {
        const { LVL_100, LVL_200 } = this.getPetLevelPrices(prices, nonCosmetic);
        return LVL_200 ? `LVL_200_${this.petId}` : LVL_100 ? `LVL_100_${this.petId}` : `LVL_1_${this.petId}`;
    }

    /**
     * Gets the pet level
     * @returns {object} The pet level
     */
    getPetLevel() {
        const maxPetLevel = SPECIAL_LEVELS[this.petData.type] ? SPECIAL_LEVELS[this.petData.type] : 100;
        const petOffset = RARITY_OFFSET[this.petData.type === 'BINGO' ? 'COMMON' : this.getTierBoostedTierName()];
        const petLEVELS = LEVELS.slice(petOffset, petOffset + maxPetLevel - 1);

        let level = 1,
            totalExp = 0;
        for (let i = 0; i < maxPetLevel; i++) {
            totalExp += petLEVELS[i];
            if (totalExp > this.petData.exp) {
                totalExp -= petLEVELS[i];
                break;
            }

            level++;
        }

        return {
            level: Math.min(level, maxPetLevel),
            xpMax: petLEVELS.reduce((a, b) => a + b, 0),
            xp: this.petData.exp,
        };
    }
}

module.exports = PetNetworthHelper;
