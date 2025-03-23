const RecombobulatorHandler = require('../../calculators/handlers/Recombobulator');
const SkyBlockItemNetworthCalculator = require('../../calculators/SkyBlockItemNetworthCalculator');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

jest.mock('../../managers/NetworthManager', () => null);

jest.mock('../../constants/itemsMap', () => {
    const itemsMapMock = new Map();
    itemsMapMock.set('HEGEMONY_ARTIFACT', { category: 'ACCESSORY' });
    itemsMapMock.set('MITHRIL_BELT', { category: 'BELT' });
    itemsMapMock.set('RADIANT_POWER_ORB', { category: 'DEPLOYABLE' });

    return {
        getHypixelItemInformationFromId: jest.fn((id) => itemsMapMock.get(id)),
    };
});

const testCases = [
    {
        description: 'Applies correctly',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'IRON_SWORD', rarity_upgrades: 1, enchantments: { sharpness: 5 } },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with accessory via category',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'HEGEMONY_ARTIFACT', rarity_upgrades: 1 },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with accessory',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '', Lore: ['MYTHIC ACCESSORY'] },
                ExtraAttributes: { id: 'TEST_ACCESSORY_WITHOUT_SKYBLOCK_ITEM', rarity_upgrades: 1 },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with hatcessory',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '', Lore: ['MYTHIC HATCESSORY'] },
                ExtraAttributes: { id: 'TEST_HATCESSORY_WITHOUT_SKYBLOCK_ITEM', rarity_upgrades: 1 },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly due to category',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'MITHRIL_BELT', rarity_upgrades: 1 },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly due to specific item exception',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'DIVAN_CHESTPLATE', rarity_upgrades: 1 },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with bonemerang',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'BONE_BOOMERANG', rarity_upgrades: 1, enchantments: { power: 5 } },
            },
        }),
        prices: { RECOMBOBULATOR_3000: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * 0.5 * APPLICATION_WORTH.recombobulator,
        expectedCalculation: [
            {
                id: 'RECOMBOBULATOR_3000',
                type: 'RECOMBOBULATOR_3000',
                price: 10000000 * 0.5 * APPLICATION_WORTH.recombobulator,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'IRON_SWORD' },
            },
        }),
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply due to category',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'RADIANT_POWER_ORB', rarity_upgrades: 1 },
            },
        }),
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply due to dungeon drop',
        item: new SkyBlockItemNetworthCalculator({
            tag: {
                display: { Name: '' },
                ExtraAttributes: { id: 'MACHINE_GUN_BOW', rarity_upgrades: 1, item_tier: 1, enchantments: { power: 5 } },
            },
        }),
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(RecombobulatorHandler, testCases).runTests();
