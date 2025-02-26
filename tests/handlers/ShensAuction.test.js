const ShensAuctionHandler = require('../../calculators/handlers/ShensAuction');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'CLOVER_HELMET',
            extraAttributes: { auction: 6, bid: 6, price: 2500000000n },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedNewPrice: 2500000000 * APPLICATION_WORTH.shensAuctionPrice,
        expectedCalculation: [
            {
                id: 'CLOVER_HELMET',
                type: 'SHENS_AUCTION',
                price: 2500000000 * APPLICATION_WORTH.shensAuctionPrice,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'RANDOM_ITEM',
            extraAttributes: { price: 1000000 },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(ShensAuctionHandler, testCases).runTests();
