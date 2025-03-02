const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { NON_COSMETIC_ITEMS } = require('../../constants/misc');
const { ValidationError } = require('../../helper/errors');
const { titleCase } = require('../../helper/functions');

/**
 * Base class for calculating the networth of an item
 */
class SkyBlockItemNetworthHelper {
    /**
     * Creates a new SkyBlockItemNetworthHelper
     * @param {object} itemData The item data containing properties like `tag` and `Count`.
     */
    constructor(itemData) {
        this.itemData = itemData;

        // Validate the item
        this.#validateItem();

        // Extract item properties
        this.itemName = this.itemData.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '').replace(/%%[^%]+%%/g, '');
        this.extraAttributes = this.itemData.tag.ExtraAttributes ?? {};
        this.itemId = this.extraAttributes.id;
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.itemLore = this.itemData.tag.display.Lore ?? [];
        this.count = this.itemData.Count ?? 1;
        this.baseItemId = this.itemId;

        // Initialize calculation properties
        this.nonCosmetic = false;
        this.calculation = [];
        this.basePrice = 0;
        this.price = 0;
    }

    /**
     * Validates that the item data is correct
     */
    #validateItem() {
        if (!this.itemData || typeof this.itemData !== 'object') {
            throw new ValidationError('Item must be an object');
        }

        if (this.itemData?.tag === undefined) {
            throw new ValidationError('Invalid item provided');
        }
    }

    /**
     * Gets the item id based on the item's properties
     * @param {object} prices A prices object generated from the getPrices function
     * @returns {string} The item id
     */
    getItemId(prices) {
        // If the item has a skin
        if (this.extraAttributes.skin && !this.nonCosmetic) {
            const itemId = `${this.itemId}_SKINNED_${this.extraAttributes.skin}`;
            if (prices[itemId] && prices[itemId] > prices[this.itemId]) {
                return itemId;
            }
        }

        // If the item is a sloth party hat
        if (this.itemId === 'PARTY_HAT_SLOTH' && this.extraAttributes.party_hat_emoji) {
            const itemId = `${this.itemId}_${this.extraAttributes.party_hat_emoji.toUpperCase()}`;
            if (prices[itemId]) {
                return itemId;
            }
        }

        // If the item is a rune
        if ((this.isUniqueRune() || this.isRune()) && !this.nonCosmetic) {
            const [runeType, runeTier] = Object.entries(this.extraAttributes.runes)[0];
            return `RUNE_${runeType}_${runeTier}`.toUpperCase();
        }

        // If the item is a new year cake
        if (this.itemId === 'NEW_YEAR_CAKE') {
            return `NEW_YEAR_CAKE_${this.extraAttributes.new_years_cake}`;
        }

        // If the item is a crab party hat
        if (['PARTY_HAT_CRAB', 'PARTY_HAT_CRAB_ANIMATED', 'BALLOON_HAT_2024'].includes(this.itemId) && this.extraAttributes.party_hat_color) {
            return `${this.itemId}_${this.extraAttributes.party_hat_color.toUpperCase()}`;
        }

        // If the item is a space helmet
        if (this.itemId === 'DCTR_SPACE_HELM' && this.extraAttributes.edition !== undefined) {
            return 'DCTR_SPACE_HELM_EDITIONED';
        }

        // If the item is a creative mind
        if (this.itemId === 'CREATIVE_MIND' && !this.extraAttributes.edition) {
            return 'CREATIVE_MIND_UNEDITIONED';
        }

        // If the item is an ancient elevator
        if (this.itemId === 'ANCIENT_ELEVATOR' && this.extraAttributes.edition !== undefined) {
            return 'ANCIENT_ELEVATOR_EDITIONED';
        }

        // If the item is the shiny variant
        if (this.extraAttributes.is_shiny && prices[`${this.itemId}_SHINY`]) {
            return `${this.itemId}_SHINY`;
        }

        // If the item is fragged
        if (this.itemId?.startsWith('STARRED_') && !prices[this.itemId] && prices[this.itemId.replace('STARRED_', '')]) {
            return this.itemId.replace('STARRED_', '');
        }

        // Otherwise, return the item id
        return this.itemId;
    }

    /**
     * Gets the item name based on the item's properties
     * @returns {string} The item name
     */
    getItemName() {
        if (['Beastmaster Crest', 'Griffin Upgrade Stone', 'Wisp Upgrade Stone'].includes(this.itemName)) {
            const tier = this.skyblockItem.tier ? titleCase(this.skyblockItem.tier.replaceAll('_', ' ')) : 'Unknown';
            return `${this.itemName} (${tier})`;
        }

        if (this.itemName.endsWith(' Exp Boost')) {
            const itemId = this.skyblockItem.id ? titleCase(this.skyblockItem.id.split('_').at(-1)) : 'Unknown';
            return `${this.itemName} (${itemId})`;
        }

        return this.itemName;
    }

    /**
     * Checks if the item is a rune
     * @returns {boolean} Whether the item is a rune
     */
    isRune() {
        const isRuneId = this.itemId === 'RUNE';
        const hasRuneType = this.extraAttributes.runes && Object.keys(this.extraAttributes.runes).length > 0;

        return isRuneId && hasRuneType;
    }

    /**
     * Checks if the item is an unique rune
     * @returns {boolean} Whether the item is an unqiue rune
     */
    isUniqueRune() {
        const isRuneId = this.itemId === 'UNIQUE_RUNE';
        const hasRuneType = this.extraAttributes.runes && Object.keys(this.extraAttributes.runes).length > 0;

        return isRuneId && hasRuneType;
    }

    /**
     * Checks if the item is cosmetic
     * @returns {boolean} Whether the item is cosmetic
     */
    isCosmetic() {
        const testId = (this.itemId + this.itemName).toUpperCase();
        const isSkinOrDye = testId.includes('DYE') || testId.includes('SKIN');
        const isCosmetic = this.skyblockItem.category === 'COSMETIC' || this.itemLore.at(-1)?.includes('COSMETIC');
        const isOnCosmeticBlacklist = NON_COSMETIC_ITEMS.has(this.itemId);

        return isCosmetic || isSkinOrDye || isOnCosmeticBlacklist || this.isRune() || this.isUniqueRune();
    }

    /**
     * Checks if the item is recombobulated
     * @returns {boolean} Whether the item is recombobulated
     */
    isRecombobulated() {
        return this.extraAttributes.rarity_upgrades > 0 && !this.extraAttributes.item_tier;
    }

    /**
     * Checks if the item is soulbound
     * @returns {boolean} Whether the item is soulbound
     */
    isSoulbound() {
        return !!(this.extraAttributes.donated_museum || this.itemLore.includes('§8§l* §8Co-op Soulbound §8§l*') || this.itemLore.includes('§8§l* §8Soulbound §8§l*'));
    }

    /**
     * Sets the base price for the item
     * @param {object} prices A prices object generated from the getPrices function
     */
    getBasePrice(prices) {
        // Get the item id and name
        this.itemName = this.getItemName();
        this.itemId = this.getItemId(prices);

        // Get the base price for the item
        const itemPrice = prices[this.itemId] ?? 0;
        this.basePrice = itemPrice * this.itemData.Count;
    }
}

module.exports = SkyBlockItemNetworthHelper;
