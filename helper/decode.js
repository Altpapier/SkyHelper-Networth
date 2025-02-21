const nbt = require('prismarine-nbt');
const { gunzip } = require('zlib');

async function decodeItems(base64Strings) {
    try {
        const decodedItems = await Promise.all(
            base64Strings.flat().map(async (item) => {
                try {
                    if (!item || !item.length) {
                        return [];
                    }

                    const unzippedData = await new Promise((resolve, reject) =>
                        gunzip(Buffer.from(item, 'base64'), (error, unzippedData) => {
                            if (error) reject(error);
                            else resolve(unzippedData);
                        }),
                    );

                    const parsed = nbt.protos.big.parsePacketBuffer('nbt', unzippedData, 0);
                    const simplified = nbt.simplify(parsed.data);
                    return simplified.i;
                } catch (error) {
                    console.error(`[SKYHELPER-NETWORTH] decodeItems() | Failed to decode item: ${error}`);
                    return null;
                }
            }),
        );

        return decodedItems.filter((item) => item !== null);
    } catch (error) {
        console.error(`[SKYHELPER-NETWORTH] decodeItems() | Failed to decode items: ${error}`);
        return [];
    }
}

async function decodeItemsObject(base64Strings) {
    try {
        const decodedItemsArray = await decodeItems(Object.values(base64Strings));
        return Object.fromEntries(Object.keys(base64Strings).map((key, idx) => [key, decodedItemsArray[idx]]));
    } catch (error) {
        console.error(`[SKYHELPER-NETWORTH] decodeItemsObject() | Failed to decode items object: ${error}`);
        return {};
    }
}

async function decodeItem(encodedItem) {
    try {
        const [, unzippedData] = await new Promise((resolve, reject) =>
            gunzip(Buffer.from(encodedItem, 'base64'), (error, unzippedData) => {
                if (error) reject(error);
                else resolve([encodedItem, unzippedData]);
            }),
        );

        const parsed = nbt.protos.big.parsePacketBuffer('nbt', unzippedData, 0);
        const simplified = nbt.simplify(parsed.data);
        return simplified.i;
    } catch (error) {
        console.error(`[SKYHELPER-NETWORTH] decodeItem() | Failed to decode item: ${error}`);
        return null;
    }
}

module.exports = {
    decodeItem,
    decodeItems,
    decodeItemsObject,
};
