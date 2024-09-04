const { tiers, soulboundPets, getPetLevel } = require('../../constants/pets');
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
        // Extract pet properties
        this.nonCosmetic = false;
        this.petData = petData;
        this.tier = this.getTier();
        this.skin = this.petData.skin;
        this.basePetId = `${this.tier}_${this.petData.type}`;
        this.petId = `${this.basePetId}${this.skin ? `_SKINNED_${this.skin}` : ''}`;
        this.level = this.getPetLevel();
        this.petName = `[Lvl ${this.level.level}] ${titleCase(`${this.tier} ${titleCase(this.basePetId)}`)}${this.petData.skin ? ' ✦' : ''}`;

        // Initialize calculation properties
        this.calculation = [];
        this.price = 0;
        this.base = 0;

        // Validate the pet
        this.#validateItem();
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
     * Gets the pet's tier
     * @returns {string} The pet's tier
     */
    getTier() {
        return this.petData.heldItem === 'PET_ITEM_TIER_BOOST' ? tiers[tiers.indexOf(this.petData.tier) - 1] : this.petData.tier;
    }

    /**
     * Checks if the pet is soulbound
     * @returns {boolean} Whether the pet is soulbound
     */
    isSoulbound() {
        return soulboundPets.includes(this.petData.type);
    }

    /**
     * Gets the pet prices at levels 1, 100, and 200 (if applicable)
     * @param {object} prices A prices object generated from the getPrices function
     * @returns {object} The pet prices at levels 1, 100, and 200 (if applicable)
     */
    getPetLevelPrices(prices) {
        // Get the base prices for the pet
        const basePrices = {
            LVL_1: prices[`LVL_1_${this.basePetId}`] || 0,
            LVL_100: prices[`LVL_100_${this.basePetId}`] || 0,
            LVL_200: prices[`LVL_200_${this.basePetId}`] || 0,
        };

        // If the pet has a skin, use the skinned prices
        if (this.skin && !this.nonCosmetic) {
            return {
                LVL_1: Math.max(prices[`LVL_1_${this.petId}`] || 0, basePrices.LVL_1),
                LVL_100: Math.max(prices[`LVL_100_${this.petId}`] || 0, basePrices.LVL_100),
                LVL_200: Math.max(prices[`LVL_200_${this.petId}`] || 0, basePrices.LVL_200),
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
        this.price = LVL_200 || LVL_100;
        if (this.level.level < 100 && this.level.xpMax) {
            const baseFormula = (LVL_100 - LVL_1) / this.level.xpMax;
            if (baseFormula) {
                this.price = baseFormula * this.level.xp + LVL_1;
            }
        }

        // Calculate the pet's price based on the percentage of the level from 100 to 200
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

    /**
     * Gets the pet level
     * @returns {object} The pet level
     */
    getPetLevel() {
        // TODO: Move from constants to helper
        return getPetLevel(this.petData);
    }
}

module.exports = PetNetworthHelper;
