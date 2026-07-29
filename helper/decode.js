const nbt = require('prismarine-nbt');
const { gunzip } = require('zlib');

async function decodeNbtData(encodedData) {
    try {
        if (!encodedData) {
            return {};
        }

        const unzippedData = await new Promise((resolve, reject) =>
            gunzip(Buffer.from(encodedData, 'base64'), (error, data) => {
                if (error) reject(error);
                else resolve(data);
            }),
        );

        const parsed = nbt.protos.big.parsePacketBuffer('nbt', unzippedData, 0);
        return nbt.simplify(parsed.data);
    } catch {
        return {};
    }
}

async function decodeItems(base64Strings) {
    try {
        return await Promise.all(
            base64Strings.flat().map(async (item) => {
                if (!item || !item.length) {
                    return [];
                }

                const decodedData = await decodeNbtData(item);
                return decodedData.i ?? [];
            }),
        );
    } catch {
        return [];
    }
}

async function decodeItemsObject(base64Strings) {
    try {
        const decodedItemsArray = await decodeItems(Object.values(base64Strings));
        return Object.fromEntries(Object.keys(base64Strings).map((key, idx) => [key, decodedItemsArray[idx] ?? []]));
    } catch {
        return {};
    }
}

async function decodeItem(encodedItem) {
    const decodedData = await decodeNbtData(encodedItem);
    return decodedData.i ?? {};
}

module.exports = {
    decodeNbtData,
    decodeItem,
    decodeItems,
    decodeItemsObject,
};
