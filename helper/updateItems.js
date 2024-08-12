const { setItems } = require('../constants/itemsMap');
const { ItemsError } = require('./errors');
const { sleep } = require('./functions');
const axios = require('axios');

async function updateItems(retries = 3, retryInterval = 1000, currentRetry = 0) {
    try {
        const response = await axios.get('https://api.hypixel.net/v2/resources/skyblock/items');
        const items = response.data.items;
        if (!items) {
            if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items`);
            console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items. Retrying (${retries - currentRetry} attempt(s) left)...`);
            await sleep(retryInterval);
            return await updateItems(retries, retryInterval, currentRetry + 1);
        }
        setItems(items);
        return;
    } catch (err) {
        if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}`);
        console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}. Retrying (${retries - currentRetry} attempt(s) left)...`);
        await sleep(retryInterval);
        return await updateItems(retries, retryInterval, currentRetry + 1);
    }
}

module.exports = { updateItems };
