const axios = require('axios');
const { ItemsError } = require('./errors');
const { sleep } = require('./functions');
const { itemsBackupLoaded } = require('../constants/itemsMap');

/**
 * Fetch items from the Hypixel API
 * @param {number} [retries = 3] The amount of retries to fetch the items when failing to fetch them
 * @param {number} [retryInterval = 1000] The interval in milliseconds to fetch the items from the Hypixel API when failing to fetch them
 * @param {number} [currentRetry = 0] The current retry count
 * @returns {Promise<object[]>} The items from the Hypixel API
 */
async function getItems(retries = 3, retryInterval = 1000, currentRetry = 0) {
    try {
        const response = await axios.get('https://api.hypixel.net/v2/resources/skyblock/items', {
            timeout: 5000,
        });
        const items = response?.data?.items;
        if (!items) {
            if (currentRetry >= retries) throw new ItemsError('Failed to retrieve items');
            console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items. Retrying (${retries - currentRetry} attempt(s) left)...`);
            await sleep(retryInterval);
            return await getItems(retries, retryInterval, currentRetry + 1);
        }
        return items;
    } catch (err) {
        const error = `[SKYHELPER-NETWORTH] ${
            axios.isAxiosError(err) ? `Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}.` : `Failed to retrieve items: ${err}.`
        }`;
        if (currentRetry >= retries) {
            if (itemsBackupLoaded) {
                console.warn(`${error} Using backup items...`);
                return null;
            } else throw new ItemsError(error);
        }
        console.warn(`${error} Retrying (${retries - currentRetry} attempt(s) left)...`);
        await sleep(retryInterval);
        return await getItems(retries, retryInterval, currentRetry + 1);
    }
}

module.exports = { getItems };
