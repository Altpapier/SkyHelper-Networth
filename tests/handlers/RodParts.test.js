const RodPartsHandler = require('../../calculators/handlers/RodParts');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: {
                line: { part: 'titan_line' },
                hook: { part: 'hotspot_hook' },
                sinker: { part: 'hotspot_sinker' },
            },
            price: 100,
            soulboundPortion: 100,
            calculation: [],
        },
        prices: { TITAN_LINE: 220000000, HOTSPOT_HOOK: 16000000, HOTSPOT_SINKER: 16000000 },
        shouldApply: true,
        expectedPriceChange: 220000000 * APPLICATION_WORTH.rodPart + 16000000 * APPLICATION_WORTH.rodPart + 16000000 * APPLICATION_WORTH.rodPart,
        expectedSoulboundPortionChange: 0,
        expectedCalculation: [
            {
                id: 'TITAN_LINE',
                type: 'ROD_PART',
                price: 220000000 * APPLICATION_WORTH.rodPart,
                count: 1,
                soulbound: false,
            },
            {
                id: 'HOTSPOT_HOOK',
                type: 'ROD_PART',
                price: 16000000 * APPLICATION_WORTH.rodPart,
                count: 1,
                soulbound: false,
            },
            {
                id: 'HOTSPOT_SINKER',
                type: 'ROD_PART',
                price: 16000000 * APPLICATION_WORTH.rodPart,
                count: 1,
                soulbound: false,
            },
        ],
    },
    {
        description: 'Applies correctly with soulbound parts',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: {
                line: { part: 'titan_line' },
                hook: { part: 'hotspot_hook', donated_museum: 1 },
            },
            price: 100,
            soulboundPortion: 100,
            calculation: [],
        },
        prices: { TITAN_LINE: 220000000, HOTSPOT_HOOK: 16000000 },
        shouldApply: true,
        expectedPriceChange: 220000000 * APPLICATION_WORTH.rodPart + 16000000 * APPLICATION_WORTH.rodPart,
        expectedSoulboundPortionChange: 16000000 * APPLICATION_WORTH.rodPart,
        expectedCalculation: [
            {
                id: 'TITAN_LINE',
                type: 'ROD_PART',
                price: 220000000 * APPLICATION_WORTH.rodPart,
                count: 1,
                soulbound: false,
            },
            {
                id: 'HOTSPOT_HOOK',
                type: 'ROD_PART',
                price: 16000000 * APPLICATION_WORTH.rodPart,
                count: 1,
                soulbound: true,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(RodPartsHandler, testCases).runTests();
