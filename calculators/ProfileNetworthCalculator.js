const { parsePrices } = require('../helper/prices');
const { calculateNetworth } = require('../helper/calculateNetworth');
const { parseItems } = require('../helper/parseItems');

const networthManager = require('./NetworthManager');

class ProfileNetworthCalculator {
    /**
     * Creates a new ProfileNetworthCalculator
     * @param {object} profileData The profile data from the Hypixel API (profile.members[uuid])
     * @param {object} [museumData] The museum data from the Hypixel API (museum.members[uuid]). If not provided, the museum data will not be included in the networth calculation
     * @param {number} bankBalance The bank balance of the player from the Hypixel API (profile.banking.balance)
     */
    constructor(profileData, museumData, bankBalance) {
        this.profileData = profileData;
        this.museumData = museumData;
        this.bankBalance = bankBalance || 0;
        this.items = {};

        this.#validate();

        this.purse = profileData.currencies?.coin_purse;
        this.personalBankBalance = profileData.profile?.bank_account;
    }

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
    static fromPreParsed(profileData, items, bankBalance) {
        const calculator = new ProfileNetworthCalculator(profileData, {}, bankBalance);
        calculator.items = items;
        return calculator;
    }

    #validate() {
        if (!this.profileData) {
            throw new ValidationError('Profile data must be provided');
        }

        if (typeof this.profileData !== 'object') {
            throw new ValidationError('Profile data must be an object');
        }

        if (!this.profileData.profile && !this.profileData.player_data && !this.profileData.leveling) {
            throw new ValidationError('Invalid profile data provided');
        }
    }

    /**
     * Returns the networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, false);
    }

    /**
     * Returns the non cosmetic networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, true);
    }

    async #calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, nonCosmetic) {
        if (!this.items) {
            this.items = await parseItems(this.profileData, this.museumData);
        }

        await postParseItems(this.profileData, this.items);
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return calculateNetworth(
            this.items,
            this.purse,
            this.bankBalance,
            this.personalBankBalance,
            parsedPrices,
            {
                onlyNetworth: onlyNetworth ?? networthManager.onlyNetworth,
                includeItemData: includeItemData ?? networthManager.includeItemData,
                stackItems: stackItems ?? networthManager.stackItems,
            },
            nonCosmetic
        );
    }
}

module.exports = { ProfileNetworthCalculator };
