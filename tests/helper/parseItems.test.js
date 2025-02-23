const { parseItems, postParseItems } = require('../../helper/parseItems');
const { decodeItems, decodeItemsObject, decodeItem } = require('../../helper/decode');

jest.mock('../../helper/decode');

describe('parseItems', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        decodeItems.mockResolvedValue([[]]);
        decodeItemsObject.mockResolvedValue({});
        decodeItem.mockResolvedValue([]);
    });

    it('should parse empty profile data', async () => {
        const profileData = { inventory: {} };
        const items = await parseItems(profileData);

        expect(items).toHaveProperty('storage', []);
        expect(items).toHaveProperty('museum', []);
    });

    it('should parse museum data', async () => {
        const mockMuseumItem = { id: 'MUSEUM_ITEM' };
        decodeItemsObject.mockResolvedValue({ test: [mockMuseumItem] });

        const museumData = {
            items: {
                test: {
                    items: { data: 'test' },
                    borrowing: false,
                },
            },
            special: [],
        };

        const items = await parseItems({}, museumData);
        expect(items.museum).toEqual([mockMuseumItem]);
    });

    it('should merge multiple museum sources correctly', async () => {
        const mockRegularItem = { id: 'REGULAR_MUSEUM_ITEM' };
        const mockSpecialItem = { id: 'SPECIAL_MUSEUM_ITEM' };

        decodeItemsObject.mockResolvedValue({ test: [mockRegularItem] });
        decodeItems.mockResolvedValue([[mockSpecialItem]]);

        const museumData = {
            items: {
                test: {
                    items: { data: 'regular_item_data' },
                    borrowing: false,
                },
            },
            special: [
                {
                    items: { data: 'special_item_data' },
                },
            ],
        };

        const items = await parseItems({}, museumData);
        expect(items.museum).toContain(mockRegularItem);
        expect(items.museum).toContain(mockSpecialItem);
    });

    it('should handle museum data with existing items array', async () => {
        const museumData = {
            items: {
                test: {
                    items: [{ id: 'DIRECT_ITEM' }],
                    borrowing: false,
                },
            },
            special: [
                {
                    items: [{ id: 'DIRECT_SPECIAL_ITEM' }],
                },
            ],
        };

        const items = await parseItems({}, museumData);
        expect(items.museum).toEqual([{ id: 'DIRECT_ITEM' }, { id: 'DIRECT_SPECIAL_ITEM' }]);
    });

    it('should handle backpack contents and icons', async () => {
        const profileData = {
            inventory: {
                backpack_contents: {
                    0: { data: 'backpack_data' },
                },
                backpack_icons: {
                    0: { data: 'icon_data' },
                },
            },
        };

        const mockBackpackItems = [{ id: 'BACKPACK_ITEM' }];
        const mockIconItems = [{ id: 'ICON_ITEM' }];

        decodeItems.mockImplementation((items) => {
            return Promise.resolve(
                items.map((item) => {
                    if (item === 'backpack_data') return mockBackpackItems;
                    if (item === 'icon_data') return mockIconItems;
                    return [];
                }),
            );
        });

        const items = await parseItems(profileData);
        expect(items.storage).toContainEqual({ id: 'BACKPACK_ITEM' });
        expect(items.storage).toContainEqual({ id: 'ICON_ITEM' });
    });
});

describe('postParseItems', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        decodeItem.mockResolvedValue([]);
    });

    it('should process cake bags', async () => {
        const items = {
            inventory: [
                {
                    tag: {
                        ExtraAttributes: {
                            new_year_cake_bag_data: 'test',
                        },
                    },
                },
            ],
        };

        const cakeItem = {
            id: 'CAKE',
            tag: {
                ExtraAttributes: {
                    new_years_cake: 2023,
                },
            },
        };

        decodeItem.mockResolvedValue([cakeItem]);

        await postParseItems({}, items);
        expect(items.inventory[0].tag.ExtraAttributes.new_year_cake_bag_years).toEqual([2023]);
    });

    it('should process sacks data', async () => {
        const profileData = {
            sacks_counts: {
                WHEAT: 100,
            },
        };

        const items = {};
        await postParseItems(profileData, items);
        expect(items.sacks).toEqual([{ id: 'WHEAT', amount: 100 }]);
    });

    it('should process essence data', async () => {
        const profileData = {
            currencies: {
                essence: {
                    WITHER: { current: 1000 },
                },
            },
        };

        const items = {};
        await postParseItems(profileData, items);
        expect(items.essence).toEqual([{ id: 'ESSENCE_WITHER', amount: 1000 }]);
    });

    it('should process pets data', async () => {
        const pet = { name: 'Test Pet', type: 'DOG' };
        const profileData = {
            pets_data: {
                pets: [pet],
            },
        };

        const items = {};
        await postParseItems(profileData, items);
        expect(items.pets).toEqual([pet]);
    });

    it('should handle empty sacks data', async () => {
        const profileData = { sacks_counts: {} };
        const items = {};

        await postParseItems(profileData, items);
        expect(items.sacks).toEqual([]);
    });

    it('should handle empty essence data', async () => {
        const profileData = {
            currencies: {
                essence: {},
            },
        };
        const items = {};

        await postParseItems(profileData, items);
        expect(items.essence).toEqual([]);
    });

    it('should handle multiple cake bags simultaneously', async () => {
        const items = {
            inventory: [
                {
                    tag: {
                        ExtraAttributes: {
                            new_year_cake_bag_data: 'test1',
                        },
                    },
                },
                {
                    tag: {
                        ExtraAttributes: {
                            new_year_cake_bag_data: 'test2',
                        },
                    },
                },
            ],
        };

        const cakeItem1 = {
            id: 'CAKE1',
            tag: { ExtraAttributes: { new_years_cake: 2022 } },
        };
        const cakeItem2 = {
            id: 'CAKE2',
            tag: { ExtraAttributes: { new_years_cake: 2023 } },
        };

        decodeItem.mockResolvedValueOnce([cakeItem1]).mockResolvedValueOnce([cakeItem2]);

        await postParseItems({}, items);
        expect(items.inventory[0].tag.ExtraAttributes.new_year_cake_bag_years).toEqual([2022]);
        expect(items.inventory[1].tag.ExtraAttributes.new_year_cake_bag_years).toEqual([2023]);
    });
});
