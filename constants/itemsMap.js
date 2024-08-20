let itemsMap = new Map();

function setItems(items) {
    itemsMap = new Map();
    for (const item of items) {
        itemsMap.set(item.id, item);
    }
}

function getHypixelItemInformationFromId(id) {
    return itemsMap.get(id);
}

module.exports = {
    getHypixelItemInformationFromId,
    setItems,
};
