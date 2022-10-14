const { NetworthError, PricesError } = require('./helper/errors');
const { parseItems } = require('./helper/parseItems');
const { calculateNetworth, calculateItemNetworth } = require('./helper/calculateNetworth');
const axios = require('axios');

/**
 * Returns the networth of a profile
 * @param {object} profileData - The profile player data from the Hypixel API (profile.members[uuid])
 * @param {number} bankBalance - The player's bank balance from the Hypixel API (profile.banking?.balance)
 * @param {{ onlyNetworth: boolean, prices: object }} options - (Optional) onlyNetworth: If true, only the networth will be returned, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
 * @returns {object} - An object containing the player's networth calculation
 */

const getNetworth = async (profileData, bankBalance, options) => {
  if (!profileData) throw new NetworthError('No profile data provided');
  if (!profileData.stats) throw new NetworthError('Invalid profile data provided');
  if (options?.prices) {
    if (!options.prices instanceof Object || options.prices[Object.keys(options.prices)[0]] instanceof Object) throw new NetworthError('Invalid prices data provided');
  }

  const purse = profileData.coin_purse;

  const prices = options?.prices || (await getPrices());

  const items = await parseItems(profileData);
  const networth = await calculateNetworth(items, purse, bankBalance, prices, options?.onlyNetworth);

  return networth;
};

/**
 * Returns the networth of an item
 * @param {object} item - The item the networth should be calculated for
 * @param {{ prices: object }} options - prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
 * @returns {object} - An object containing the item's networth calculation
 */
const getItemNetworth = async (item, options) => {
  if (options?.prices) {
    if (!options.prices instanceof Object || options.prices[Object.keys(options.prices)[0]] instanceof Object) throw new NetworthError('Invalid prices data provided');
  }

  if (!item?.tag && !item?.exp) throw new NetworthError('Invalid item provided');

  const prices = options?.prices || (await getPrices());

  return await calculateItemNetworth(item, prices);
};

/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
const getPrices = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/prices.json');

    // Remove this later when prices.json file is updated
    if (response.data[Object.keys(response.data)[0]] instanceof Object) {
      const prices = {};
      for (const [item, priceObject] of Object.entries(response.data)) {
        prices[item] = priceObject.price;
      }
      return prices;
    }
    // -----------------------------

    return response.data;
  } catch (err) {
    throw new PricesError(`Failed to retrieve prices with status code ${err?.response?.status || 'Unknown'}`);
  }
};

module.exports = {
  getNetworth,
  getItemNetworth,
  getPrices,
};
