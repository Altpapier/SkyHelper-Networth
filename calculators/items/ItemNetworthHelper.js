const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { titleCase } = require('../../helper/functions');

class ItemNetworthHelper {
    constructor(itemData, prices) {
        this.itemData = itemData;
        this.itemName = this.itemData.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '');
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.itemId = this.itemData.tag.ExtraAttributes.id.toLowerCase();
        this.extraAttributes = this.itemData.tag.ExtraAttributes ?? {};
        this.itemLore = this.itemData.tag.display.Lore ?? [];
        this.petId = this.itemData.type;
        this.baseItemId = this.itemId;

        this.prices = prices;
        this.calculation = [];
        this.price = 0;
        this.base = 0;

        this.getBasePrice();
    }

    getItemId() {
        if (this.extraAttributes.skin && !this.nonCosmetic) {
            const itemId = `${this.itemId}_SKINNED_${this.extraAttributes.skin.toLowerCase()}`;
            if (this.prices[itemId]) {
                return itemId;
            }
        }

        if (this.itemId === 'PARTY_HAT_SLOTH' && this.extraAttributes.party_hat_emoji) {
            const itemId = `${this.itemId}_${this.extraAttributes.party_hat_emoji.toLowerCase()}`;
            if (this.prices[itemId]) {
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
        if (this.extraAttributes.is_shiny && this.prices[`${this.itemId}_SHINY`]) {
            return `${this.itemId}_shiny`;
        }

        if (this.itemId.startsWith('STARRED_') && !this.prices[this.itemId] && this.prices[this.itemId.replace('STARRED_', '')]) {
            return this.itemId.replace('STARRED_', '');
        }

        return this.itemId;
    }

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

    isRune() {
        const isRuneId = this.itemId === 'RUNE' || this.itemId === 'UNIQUE_RUNE';
        const hasRuneType = this.extraAttributes.runes && Object.keys(this.extraAttributes.runes).length > 0;

        return isRuneId && hasRuneType;
    }

    isCosmetic() {
        const testId = (this.itemId + this.itemName).toLowerCase();
        const isSkinOrDye = testId.includes('dye') || testId.includes('skin');
        const isCosmetic = this.skyblockItem.category === 'COSMETIC' || this.itemLore.at(-1)?.includes('COSMETIC');

        return isCosmetic || isSkinOrDye || this.isRune();
    }

    isRecombobulated() {
        return this.itemData.tag.ExtraAttributes.rarity_upgrades > 0 && !this.itemData.tag.ExtraAttributes.item_tier;
    }

    isSoulbound() {
        return !!(
            this.itemData.tag.ExtraAttributes.donated_museum ||
            this.itemLore.includes('§8§l* §8Co-op Soulbound §8§l*') ||
            this.itemLore.includes('§8§l* §8Soulbound §8§l*')
        );
    }

    getBasePrice() {
        this.itemName = this.getItemName();
        this.itemId = this.getItemId();

        const itemPrice = this.prices[this.itemId] ?? 0;
        this.price = itemPrice * this.itemData.Count;
        this.base = itemPrice * this.itemData.Count;
        if (this.extraAttributes.skin && !this.nonCosmetic) {
            const newPrice = this.prices[this.itemData.tag.this.itemId.toLowerCase()];
            if (newPrice && newPrice > this.price) {
                this.price = newPrice * this.itemData.Count;
                this.base = newPrice * this.itemData.Count;
            }
        }

        if (!this.price && this.extraAttributes.price) {
            this.price = parseInt(this.extraAttributes.price) * 0.85;
            this.base = parseInt(this.extraAttributes.price) * 0.85;
        }
    }
}

module.exports = ItemNetworthHelper;
