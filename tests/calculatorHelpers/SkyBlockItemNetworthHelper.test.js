const { describe, test, expect, beforeEach } = require('@jest/globals');
const SkyBlockItemNetworthHelper = require('../../calculators/helpers/SkyBlockItemNetworthHelper');
const { ValidationError } = require('../../helper/errors');

jest.mock('../../constants/itemsMap', () => ({
    getHypixelItemInformationFromId: jest.fn().mockImplementation((id) => ({
        id,
        tier: 'COMMON',
        category: id.includes('COSMETIC') ? 'COSMETIC' : 'WEAPON',
    })),
}));

jest.mock('../../constants/misc', () => ({
    NON_COSMETIC_ITEMS: new Set(['NON_COSMETIC_ITEM']),
}));

describe('SkyBlockItemNetworthHelper', () => {
    let validItemData;

    beforeEach(() => {
        validItemData = {
            tag: {
                display: {
                    Name: '§6Test Item',
                    Lore: ['Test Lore'],
                },
                ExtraAttributes: {
                    id: 'TEST_ITEM',
                },
            },
            Count: 1,
        };
    });

    describe('Constructor', () => {
        test('should initialize with valid item data', () => {
            const helper = new SkyBlockItemNetworthHelper(validItemData);
            expect(helper.itemName).toBe('Test Item');
            expect(helper.itemId).toBe('TEST_ITEM');
        });

        test('should throw ValidationError for invalid item data', () => {
            expect(() => new SkyBlockItemNetworthHelper(null)).toThrow(ValidationError);
            expect(() => new SkyBlockItemNetworthHelper({})).toThrow(ValidationError);
        });
    });

    describe('getItemId', () => {
        test('should handle skinned items with price', () => {
            const itemData = {
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    ExtraAttributes: {
                        id: 'TEST_ITEM',
                        skin: 'NEW_SKIN',
                    },
                },
            };
            const helper = new SkyBlockItemNetworthHelper(itemData);
            const prices = {
                TEST_ITEM: 100,
                TEST_ITEM_SKINNED_NEW_SKIN: 200,
            };
            expect(helper.getItemId(prices)).toBe('TEST_ITEM_SKINNED_NEW_SKIN');
        });

        test('should handle skinned items without price', () => {
            const itemData = {
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    ExtraAttributes: {
                        id: 'TEST_ITEM',
                        skin: 'NEW_SKIN',
                    },
                },
            };
            const helper = new SkyBlockItemNetworthHelper(itemData);
            const prices = {
                TEST_ITEM: 100,
            };
            expect(helper.getItemId(prices)).toBe('TEST_ITEM');
        });

        test('should handle runes', () => {
            const itemData = {
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    ExtraAttributes: {
                        id: 'RUNE',
                        runes: { BLOOD: 3 },
                    },
                },
            };
            const helper = new SkyBlockItemNetworthHelper(itemData);
            expect(helper.getItemId({})).toBe('RUNE_BLOOD_3');
        });
    });

    describe('Helper Methods', () => {
        test('isRune should correctly identify runes', () => {
            const runeItem = new SkyBlockItemNetworthHelper({
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    ExtraAttributes: {
                        id: 'RUNE',
                        runes: { BLOOD: 3 },
                    },
                },
            });
            expect(runeItem.isRune()).toBe(true);
        });

        test('isCosmetic should identify cosmetic items', () => {
            const cosmeticItem = new SkyBlockItemNetworthHelper({
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    ExtraAttributes: {
                        id: 'COSMETIC_ITEM',
                    },
                },
            });
            expect(cosmeticItem.isCosmetic()).toBe(true);
        });

        test('isSoulbound should identify soulbound items', () => {
            const soulboundItem = new SkyBlockItemNetworthHelper({
                ...validItemData,
                tag: {
                    ...validItemData.tag,
                    display: {
                        ...validItemData.tag.display,
                        Lore: ['§8§l* §8Soulbound §8§l*'],
                    },
                },
            });
            expect(soulboundItem.isSoulbound()).toBe(true);
        });
    });

    describe('Price Calculations', () => {
        test('getBasePrice should calculate correct base price', () => {
            const helper = new SkyBlockItemNetworthHelper(validItemData);
            const prices = { TEST_ITEM: 1000 };
            helper.getBasePrice(prices);
            expect(helper.basePrice).toBe(1000);
        });

        test('getBasePrice should handle count multiplier', () => {
            const itemWithCount = {
                ...validItemData,
                Count: 5,
            };
            const helper = new SkyBlockItemNetworthHelper(itemWithCount);
            const prices = { TEST_ITEM: 1000 };
            helper.getBasePrice(prices);
            expect(helper.basePrice).toBe(5000);
        });
    });

    describe('getItemId special cases', () => {
        test('should handle sloth party hat with emoji', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Sloth Hat' },
                    ExtraAttributes: {
                        id: 'PARTY_HAT_SLOTH',
                        party_hat_emoji: 'COOL',
                    },
                },
            });
            const prices = { PARTY_HAT_SLOTH_COOL: 1000 };
            expect(helper.getItemId(prices)).toBe('PARTY_HAT_SLOTH_COOL');
        });

        test('should handle unique runes', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Unique Rune' },
                    ExtraAttributes: {
                        id: 'UNIQUE_RUNE',
                        runes: { MUSIC: 3 },
                    },
                },
            });
            expect(helper.getItemId({})).toBe('RUNE_MUSIC_3');
        });

        test('should handle new year cake', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'New Year Cake' },
                    ExtraAttributes: {
                        id: 'NEW_YEAR_CAKE',
                        new_years_cake: 2024,
                    },
                },
            });
            expect(helper.getItemId({})).toBe('NEW_YEAR_CAKE_2024');
        });

        test('should handle crab party hats with colors', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Crab Hat' },
                    ExtraAttributes: {
                        id: 'PARTY_HAT_CRAB',
                        party_hat_color: 'RED',
                    },
                },
            });
            expect(helper.getItemId({})).toBe('PARTY_HAT_CRAB_RED');
        });

        test('should handle balloon hat 2024 with colors', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Balloon Hat' },
                    ExtraAttributes: {
                        id: 'BALLOON_HAT_2024',
                        party_hat_color: 'BLUE',
                    },
                },
            });
            expect(helper.getItemId({})).toBe('BALLOON_HAT_2024_BLUE');
        });

        test('should handle attribute shards', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Bitbug' },
                    ExtraAttributes: {
                        id: 'ATTRIBUTE_SHARD',
                        attributes: { cookie_eater: 1 },
                    },
                },
            });
            expect(helper.getItemId({})).toBe('ATTRIBUTE_SHARD_COOKIE_EATER');
        });

        test('should handle space helmet with edition', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Space Helmet' },
                    ExtraAttributes: {
                        id: 'DCTR_SPACE_HELM',
                        edition: 1,
                    },
                },
            });
            expect(helper.getItemId({})).toBe('DCTR_SPACE_HELM_EDITIONED');
        });

        test('should handle creative mind without edition', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Creative Mind' },
                    ExtraAttributes: {
                        id: 'CREATIVE_MIND',
                    },
                },
            });
            expect(helper.getItemId({})).toBe('CREATIVE_MIND_UNEDITIONED');
        });

        test('should handle ancient elevator with edition', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Ancient Elevator' },
                    ExtraAttributes: {
                        id: 'ANCIENT_ELEVATOR',
                        edition: 1,
                    },
                },
            });
            expect(helper.getItemId({})).toBe('ANCIENT_ELEVATOR_EDITIONED');
        });

        test('should handle shiny variant items', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Shiny Item' },
                    ExtraAttributes: {
                        id: 'TEST_ITEM',
                        is_shiny: true,
                    },
                },
            });
            const prices = { TEST_ITEM_SHINY: 1000 };
            expect(helper.getItemId(prices)).toBe('TEST_ITEM_SHINY');
        });

        test('should handle fragged items', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Fragged Item' },
                    ExtraAttributes: {
                        id: 'STARRED_TEST_ITEM',
                    },
                },
            });
            const prices = { TEST_ITEM: 1000 };
            expect(helper.getItemId(prices)).toBe('TEST_ITEM');
        });

        test('should return original item id when no special cases match', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Regular Item' },
                    ExtraAttributes: {
                        id: 'NORMAL_ITEM',
                    },
                },
            });
            expect(helper.getItemId({})).toBe('NORMAL_ITEM');
        });
    });

    describe('getItemName', () => {
        test('should handle Beastmaster Crest, Griffin Upgrade Stone, and Wisp Upgrade Stone', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Beastmaster Crest' },
                    ExtraAttributes: {
                        id: 'BEASTMASTER_CREST',
                        tier: 'COMMON',
                    },
                },
            });
            expect(helper.getItemName()).toBe('Beastmaster Crest (Common)');
        });

        test('should handle items ending with Exp Boost', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Test Exp Boost' },
                    ExtraAttributes: {
                        id: 'TEST_EXP_BOOST',
                    },
                },
            });
            expect(helper.getItemName()).toBe('Test Exp Boost (Boost)');
        });

        test('should return original item name when no special cases match', () => {
            const helper = new SkyBlockItemNetworthHelper({
                tag: {
                    display: { Name: 'Regular Item' },
                    ExtraAttributes: {
                        id: 'NORMAL_ITEM',
                    },
                },
            });
            expect(helper.getItemName()).toBe('Regular Item');
        });
    });
});
