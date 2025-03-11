const SoulboundSkinHandler = require('../../calculators/handlers/SoulboundSkin');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const SkyBlockItemNetworthCalculator = require('../../calculators/SkyBlockItemNetworthCalculator');
const BaseHandlerTest = require('./BaseHandlerTest');

jest.mock('../../managers/NetworthManager', () => null);

const testCases = [
    {
        description: 'Applies correctly',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: 'Diamond Necron Head', Lore: ['§8§l* §8Co-op Soulbound §8§l*'] },
                ExtraAttributes: { id: 'DIAMOND_NECRON_HEAD', skin: 'NECRON_DIAMOND_KNIGHT' },
            },
        }),
        prices: { NECRON_DIAMOND_KNIGHT: 60000000 },
        shouldApply: true,
        expectedPriceChange: 60000000 * APPLICATION_WORTH.soulboundPetSkins,
        expectedCalculation: [
            {
                id: 'NECRON_DIAMOND_KNIGHT',
                type: 'SOULBOUND_SKIN',
                price: 60000000 * APPLICATION_WORTH.soulboundPetSkins,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply with no skin',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: 'Diamond Necron Head' },
                ExtraAttributes: { id: 'DIAMOND_NECRON_HEAD' },
            },
        }),
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply when not soulbound',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: 'Diamond Necron Head' },
                ExtraAttributes: { id: 'DIAMOND_NECRON_HEAD', skin: 'NECRON_DIAMOND_KNIGHT' },
            },
        }),
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply when already has skin value',
        item: {
            itemId: 'WITHER_GOGGLES_SKINNED_WITHER_GOGGLES_CELESTIAL',
            extraAttributes: { skin: 'WITHER_GOGGLES_CELESTIAL' },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(SoulboundSkinHandler, testCases).runTests();
