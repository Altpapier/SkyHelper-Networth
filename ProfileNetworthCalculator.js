const { parsePrices } = require('./helper/prices');
const { calculateNetworth } = require('./helper/calculateNetworth');
const { parseItems } = require('./helper/parseItems');
const { validateProfileData } = require('./helper/validate');

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
        this.museumData = museumData || {};
        this.bankBalance = bankBalance || 0;

        validateProfileData(this.profileData);

        this.purse = profileData.currencies?.coin_purse;
        this.personalBankBalance = profileData.profile?.bank_account;
    }

    /**
     * Returns the networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getNetworth(prices) {
        return this.#calculate(prices, false);
    }

    /**
     * Returns the non cosmetic networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices) {
        return this.#calculate(prices, true);
    }

    async #calculate(prices, nonCosmetic) {
        const parsedPrices = await parsePrices(prices, networthManager.cachePrices, networthManager.pricesRetries);
        const items = await parseItems(this.profileData, this.museumData);
        await networthManager.itemsPromise;
        return calculateNetworth(items, this.purse, this.bankBalance, this.personalBankBalance, parsedPrices, networthManager, nonCosmetic);
    }
}

module.exports = { ProfileNetworthCalculator };
