const { decodeItem, decodeItems, decodeItemsObject } = require('../../helper/decode');
const nbt = require('prismarine-nbt');
const { gzipSync } = require('zlib');

describe('Decode functions', () => {
    const mockNBTData = { Count: 1, id: 'test_item' };
    const nbtComponent = nbt.comp({
        i: nbt.comp({
            id: nbt.string('test_item'),
            Count: nbt.short(1),
        }),
    });

    const encodedNBT = nbt.writeUncompressed(nbtComponent, 'big');
    const gzippedEncodedNBT = gzipSync(encodedNBT);

    describe('decodeItem', () => {
        test('should decode valid base64 NBT item data', async () => {
            const result = await decodeItem(gzippedEncodedNBT);
            expect(result).toEqual(mockNBTData);
        });

        test('should return empty object for invalid input (invalid base64)', async () => {
            const result = await decodeItem('invalid-base64');
            expect(result).toEqual({});
        });

        test('should return empty object for invalid input (null)', async () => {
            const result = await decodeItem(null);
            expect(result).toEqual({});
        });
    });

    describe('decodeItems', () => {
        test('should decode array of valid base64 NBT items', async () => {
            const result = await decodeItems([gzippedEncodedNBT]);
            expect(result).toEqual([mockNBTData]);
        });

        test('should filter out invalid items', async () => {
            const result = await decodeItems([gzippedEncodedNBT, 'invalid-base64']);
            expect(result).toEqual([mockNBTData, []]);
        });

        test('should return empty array for empty input', async () => {
            const result = await decodeItems([]);
            expect(result).toEqual([]);
        });

        test('should return empty array for invalid input', async () => {
            const result = await decodeItems([null]);
            expect(result).toEqual([[]]);
        });

        test('should return null for invalid input (null)', async () => {
            const result = await decodeItems(null);
            expect(result).toEqual([]);
        });

        test('should return null for invalid input (empty string)', async () => {
            const result = await decodeItems('');
            expect(result).toEqual([]);
        });

        test('should return null for invalid input (nothing)', async () => {
            const result = await decodeItems();
            expect(result).toEqual([]);
        });
    });

    describe('decodeItemsObject', () => {
        test('should decode object with valid base64 NBT items', async () => {
            const input = { key: gzippedEncodedNBT };
            const result = await decodeItemsObject(input);
            expect(result).toEqual({ key: mockNBTData });
        });

        test('should return empty object for invalid input (invalid base54)', async () => {
            const result = await decodeItemsObject({ key: 'invalid-base64' });
            expect(result).toEqual({ key: [] });
        });

        test('should return empty object for invalid input (null)', async () => {
            const result = await decodeItemsObject({ key: null });
            expect(result).toEqual({ key: [] });
        });

        test('should return empty object for empty input', async () => {
            const result = await decodeItemsObject({});
            expect(result).toEqual({});
        });

        test('should return empty object for invalid input', async () => {
            const result = await decodeItemsObject(null);
            expect(result).toEqual({});
        });
    });
});
