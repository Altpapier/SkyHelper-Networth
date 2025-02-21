const { PricesError } = require('./errors');
const axios = require('axios');

let cachedPrices;
let isLoadingPrices = null;
/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @param {boolean} [cache=true] - (Optional) By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github
 * @param {number} [retries=3] - (Optional) By default 3 retries. If set to a negative value, throws error.
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
async function getPrices(cache = true, cacheTime = 1000 * 60 * 5, retries = 3) {
    if (retries <= 0) throw new PricesError('Failed to retrieve prices');

    if (cachedPrices?.lastCache > Date.now() - cacheTime && cache) return cachedPrices.prices;

    if (isLoadingPrices) return isLoadingPrices;

    isLoadingPrices = (async () => {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/pricesV2.json');

            cachedPrices = { prices: response.data, lastCache: Date.now() };
            return response.data;
        } catch (e) {
            if (retries <= 0) {
                throw new PricesError(`Failed to retrieve prices with status code ${e?.response?.status || 'Unknown'}`);
            } else {
                console.warn(
                    `[SKYHELPER-NETWORTH] Failed to retrieve prices with status code ${e?.response?.status || 'Unknown'}. Retrying (${retries} attempt(s) left)...`,
                );
                return getPrices(cache, cacheTime, retries - 1);
            }
        } finally {
            isLoadingPrices = null;
        }
    })();

    return isLoadingPrices;
}

module.exports = { getPrices };
