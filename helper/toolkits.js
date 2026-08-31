const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const { decodeNbtData } = require('./decode');
const { titleCase } = require('./functions');

const TOOLKIT_METADATA_KEYS = new Set(['IN_USE', 'IS_UNLOCKED']);

function isObject(value) {
    return value !== null && typeof value === 'object';
}

function isRecord(value) {
    return isObject(value) && !Array.isArray(value);
}

function createToolkitItem(extraAttributes) {
    const itemData = getHypixelItemInformationFromId(extraAttributes.id);

    return {
        Count: 1,
        tag: {
            ExtraAttributes: extraAttributes,
            display: {
                Name: itemData?.name ?? titleCase(extraAttributes.id),
                Lore: [],
            },
        },
    };
}

async function parseToolkit(toolkit) {
    if (!isRecord(toolkit) || !toolkit.IS_UNLOCKED) {
        return [];
    }

    const inUseByCategory = isObject(toolkit.IN_USE) ? toolkit.IN_USE : {};
    const categories = Array.from(new Set([...Object.keys(toolkit), ...Object.keys(inUseByCategory)])).filter((category) => !TOOLKIT_METADATA_KEYS.has(category));

    const encodedItems = [];
    for (const category of categories) {
        const categoryItems = toolkit[category];
        const inUseSlots = isObject(inUseByCategory[category]) ? inUseByCategory[category] : {};
        if (!isObject(categoryItems)) {
            continue;
        }

        for (const [index, toolkitItem] of Object.entries(categoryItems)) {
            if (inUseSlots[index] === true || !isRecord(toolkitItem) || typeof toolkitItem.data !== 'string' || !toolkitItem.data) {
                continue;
            }

            encodedItems.push(toolkitItem.data);
        }
    }

    const decodedItems = await Promise.all(encodedItems.map((encodedItem) => decodeNbtData(encodedItem)));
    return decodedItems
        .filter((extraAttributes) => isRecord(extraAttributes) && typeof extraAttributes.id === 'string' && extraAttributes.id.length > 0)
        .map(createToolkitItem);
}

module.exports = {
    parseToolkit,
};
