const { parsePrices } = require('./helper/prices');
const { calculateNetworth } = require('./helper/calculateNetworth');
const { parseItems, postParseItems } = require('./helper/parseItems');
const { validateProfileData } = require('./helper/validate');

const networthManager = require('./NetworthManager');

class PreDecodedNetworthCalculator {
    /**
     * Creates a new PreDecodedNetworthCalculator
     * @param {object} profileData The profile data from the Hypixel API (profile.members[uuid])
     * @param {{
     *          armor: [],
     *          equipment: [],
     *          wardrobe: [],
     *          inventory: [],
     *          enderchest: [],
     *          accessories: [],
     *          personal_vault: [],
     *          storage: [],
     *          fishing_bag: [],
     *          potion_bag: [],
     *          sacks_bag: [],
     *          candy_inventory: [],
     *          carnival_mask_inventory: [],
     *          museum: [],
     *        }} items Pre-parsed inventories, most inventories are just decoded except for sacks, essence, and pets which are parsed specifically as listed above, museum is an array of member[uuid].items and member[uuid].special combined and decoded (see {@link parseItems})
     * @param {number} bankBalance The bank balance of the player from the Hypixel API (profile.banking.balance)
     */
    constructor(profileData, items, bankBalance) {
        this.profileData = profileData;
        this.items = items || {};
        this.bankBalance = bankBalance || 0;

        validateProfileData(this.profileData);

        this.purse = profileData.currencies?.coin_purse;
        this.personalBankBalance = profileData.profile?.bank_account;
    }

    /**
     * Returns the networth of a profile with pre-decoded items
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getNetworth(prices) {
        return this.#calculate(prices, false);
    }

    /**
     * Returns the non cosmetic networth of a profile with pre-decoded items
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices) {
        return this.#calculate(prices, true);
    }

    async #calculate(prices, nonCosmetic) {
        await postParseItems(this.profileData, this.items);
        const parsedPrices = await parsePrices(prices, networthManager.cachePrices, networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return calculateNetworth(this.items, this.purse, this.bankBalance, this.personalBankBalance, parsedPrices, networthManager, nonCosmetic);
    }
}

module.exports = { PreDecodedNetworthCalculator };
