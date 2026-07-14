const { getHypixelItemInformationFromId } = require('../constants/itemsMap');

function titleCase(str) {
    if (!str) return '';

    if (typeof str !== 'string') {
        return '';
    }

    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createToolkitItem(extraAttributes = {}) {
    const itemData = getHypixelItemInformationFromId(extraAttributes.id);
    if (!itemData) {
        return {
            Count: 1,
            tag: {
                ExtraAttributes: extraAttributes,
                display: {
                    Name: titleCase(extraAttributes.id),
                    Lore: [],
                },
            },
        };
    }

    return {
        Count: 1,
        tag: {
            ExtraAttributes: extraAttributes,
            display: {
                Name: itemData.name,
                Lore: [],
            },
        },
    };
}

module.exports = {
    titleCase,
    sleep,
    createToolkitItem,
};
