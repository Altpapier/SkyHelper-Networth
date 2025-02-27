const SoulboundPetSkinHandler = require('../../calculators/handlers/SoulboundPetSkin');
const PetNetworthCalculator = require('../../calculators/PetNetworthCalculator');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

jest.mock('../../managers/NetworthManager', () => null);

const testCases = [
    {
        description: 'Applies correctly',
        item: new PetNetworthCalculator({
            type: 'GRANDMA_WOLF',
            tier: 'LEGENDARY',
            exp: 0,
            skin: 'GRANDMA_WOLF_REAL',
        }),
        prices: { PET_SKIN_GRANDMA_WOLF_REAL: 65000000 },
        shouldApply: true,
        expectedPriceChange: 65000000 * APPLICATION_WORTH.soulboundPetSkins,
        expectedCalculation: [
            {
                id: 'GRANDMA_WOLF_REAL',
                type: 'SOULBOUND_PET_SKIN',
                price: 65000000 * APPLICATION_WORTH.soulboundPetSkins,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: new PetNetworthCalculator({ type: 'BLACK_CAT', tier: 'MYTHIC', exp: 0 }),
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply',
        item: new PetNetworthCalculator({ type: 'BLACK_CAT', tier: 'MYTHIC', exp: 0, skin: 'BLACK_CAT_PURRANORMAL' }),
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(SoulboundPetSkinHandler, testCases).runTests();
