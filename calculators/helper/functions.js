const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');

class Helper {
    constructor(itemData, itemId, itemName, itemLore, skyblockItem) {
        this.skyblockItem = skyblockItem;
        this.itemName = itemName;
        this.itemData = itemData;
        this.itemLore = itemLore;
        this.itemId = itemId;
    }

    getItemId() {
        if (this.extraAttributes.skin && !nonCosmetic) {
            const itemId = `${this.itemId}_SKINNED_${this.extraAttributes.skin.toLowerCase()}`;
            if (prices[itemId]) {
                return itemId;
            }
        }

        if (this.itemId === 'PARTY_HAT_SLOTH' && this.extraAttributes.party_hat_emoji) {
            const itemId = `${this.itemId}_${this.extraAttributes.party_hat_emoji.toLowerCase()}`;
            if (prices[itemId]) {
                return itemId;
            }
        }

        if (this.isRune()) {
            const [runeType, runeTier] = Object.entries(this.extraAttributes.runes)[0];
            return `RUNE_${runeType}_${runeTier}`.toLowerCase();
        }

        if (this.itemId === 'NEW_YEAR_CAKE') {
            return `NEW_YEAR_CAKE_${this.extraAttributes.new_years_cake}`;
        }

        if (['PARTY_HAT_CRAB', 'PARTY_HAT_CRAB_ANIMATED', 'BALLOON_HAT_2024'].includes(this.itemId) && this.extraAttributes.party_hat_color) {
            return `${this.itemId.toLowerCase()}_${this.extraAttributes.party_hat_color}`;
        }

        if (this.itemId === 'DCTR_SPACE_HELM' && this.extraAttributes.edition !== undefined) {
            return 'DCTR_SPACE_HELM_EDITIONED';
        }

        if (this.itemId === 'CREATIVE_MIND' && !this.extraAttributes.edition) {
            ('CREATIVE_MIND_UNEDITIONED');
        }
        if (this.extraAttributes.is_shiny && prices[`${this.itemId}_SHINY`]) {
            return `${this.itemId}_shiny`;
        }

        if (this.itemId.startsWith('STARRED_') && !prices[this.itemId] && prices[this.itemId.replace('STARRED_', '')]) {
            return this.itemId.replace('STARRED_', '');
        }

        return this.itemId;
    }

    getItemName() {
        if (['Beastmaster Crest', 'Griffin Upgrade Stone', 'Wisp Upgrade Stone'].includes(this.itemName)) {
            const tier = skyblockItem.tier ? titleCase(skyblockItem.tier.replaceAll('_', ' ')) : 'Unknown';
            return `${this.itemName} (${tier})`;
        }

        if (this.itemName.endsWith(' Exp Boost')) {
            const itemId = skyblockItem.id ? titleCase(skyblockItem.id.split('_').at(-1)) : 'Unknown';
            return `${this.itemName} (${itemId})`;
        }

        return this.itemName;
    }

    isRune() {
        const isRuneId = this.itemId === 'RUNE' || this.itemId === 'UNIQUE_RUNE';
        const hasRuneType = this.extraAttributes.runes && Object.keys(this.extraAttributes.runes).length > 0;

        return isRuneId && hasRuneType;
    }

    isCosmetic() {
        const skyblockItem = getHypixelItemInformationFromId(this.itemId) || {};
        const testId = (this.itemId + this.itemName).toLowerCase();

        const isCosmetic = skyblockItem.category === 'COSMETIC' || this.itemLore.at(-1)?.includes('COSMETIC');
        const isSkinOrDye = testId.includes('dye') || testId.includes('skin');

        return isCosmetic || isSkinOrDye || this.isRune();
    }

    isRecombobulated() {
        return this.extraAttributes.rarity_upgrades > 0 && !this.extraAttributes.item_tier;
    }

    isSoulbound() {
        return !!(
            this.itemData.extraAttributes.donated_museum ||
            this.itemLore.includes('§8§l* §8Co-op Soulbound §8§l*') ||
            this.itemLore.includes('§8§l* §8Soulbound §8§l*')
        );
    }
}

module.exports = { Helper };
