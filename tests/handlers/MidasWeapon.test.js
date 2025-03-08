const MidasWeaponHandler = require('../../calculators/handlers/MidasWeapon');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly less than max price paid',
        item: {
            itemId: 'MIDAS_SWORD',
            extraAttributes: { winning_bid: 10000000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly less than max price paid with additonal coins',
        item: {
            itemId: 'MIDAS_SWORD',
            extraAttributes: { winning_bid: 20000000, additional_coins: 25000000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly max price paid',
        item: {
            itemId: 'MIDAS_SWORD',
            extraAttributes: { winning_bid: 50000000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { MIDAS_SWORD_50M: 300000000 },
        shouldApply: true,
        expectedNewBasePrice: 300000000,
        expectedCalculation: [
            {
                id: 'MIDAS_SWORD',
                type: 'MIDAS_SWORD_50M',
                price: 300000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly max price paid + additional coins',
        item: {
            itemId: 'MIDAS_STAFF',
            extraAttributes: { winning_bid: 50000000, additional_coins: 50000000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { MIDAS_STAFF_100M: 400000000 },
        shouldApply: true,
        expectedNewBasePrice: 400000000,
        expectedCalculation: [
            {
                id: 'MIDAS_STAFF',
                type: 'MIDAS_STAFF_100M',
                price: 400000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly max price paid',
        item: {
            itemId: 'STARRED_MIDAS_STAFF',
            extraAttributes: { winning_bid: 50000000, additional_coins: 1000000000000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { STARRED_MIDAS_STAFF_500M: 580000000 },
        shouldApply: true,
        expectedNewBasePrice: 580000000,
        expectedCalculation: [
            {
                id: 'STARRED_MIDAS_STAFF',
                type: 'STARRED_MIDAS_STAFF_500M',
                price: 580000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(MidasWeaponHandler, testCases).runTests();
