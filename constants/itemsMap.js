const fs = require('fs');
const path = require('path');

let itemsMap = new Map();

let lastSave = 0;
let itemsBackupLoaded = false;

function setItems(items) {
    itemsMap = new Map();
    for (const item of items) {
        itemsMap.set(item.id, item);
    }

    // Save items to a file
    if (lastSave + 1000 * 60 * 60 * 12 > Date.now()) return; // Save every 12 hours
    const filePath = path.join(__dirname, '..', '.itemsBackup.json');
    fs.writeFileSync(filePath, JSON.stringify(Array.from(itemsMap.entries())));
    lastSave = Date.now();
}

function loadItems() {
    const filePath = path.join(__dirname, '..', '.itemsBackup.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const itemsArray = JSON.parse(data);
        itemsMap = new Map(itemsArray);
        itemsBackupLoaded = true;
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
