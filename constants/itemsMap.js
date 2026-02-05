const fs = require('fs');
const path = require('path');
const { getItems } = require('../helper/items');

let itemsMap = new Map();

let lastSave = 0;
let itemsBackupLoaded = false;

// Check if running in a serverless environment
const isServerless = !!(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.FUNCTIONS_WORKER_RUNTIME
);

function setItems(items) {
    itemsMap = new Map();
    for (const item of items) {
        itemsMap.set(item.id, item);
    }

    if (isServerless) {
        return;
    }

    // Save items to a file
    if (lastSave + 1000 * 60 * 60 * 12 > Date.now()) return; // Save every 12 hours
    const filePath = path.join(__dirname, '..', '.itemsBackup.json');
    fs.writeFileSync(filePath, JSON.stringify(Array.from(itemsMap.entries())));
    lastSave = Date.now();
}

function loadItems() {
    if (isServerless) {
        return;
    }

    const filePath = path.join(__dirname, '..', '.itemsBackup.json');
    if (fs.existsSync(filePath) === false) {
        return;
    }

    try {
        const data = fs.readFileSync(filePath);
        const itemsArray = JSON.parse(data);
        itemsMap = new Map(itemsArray);
        itemsBackupLoaded = true;
    } catch (error) {
        console.log('[SKYHELPER-NETWORTH] Failed to load backup items. Fetching new items...');
        fs.unlinkSync(filePath); // Delete the corrupted backup file
    }
}

loadItems();

function getHypixelItemInformationFromId(id) {
    return itemsMap.get(id);
}

module.exports = {
    getHypixelItemInformationFromId,
    setItems,
    itemsBackupLoaded,
};
