const DroneModsHanler = require('../../calculators/handlers/DroneMods');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies 2 mods correctly',
        item: {
            petData: { type: 'PRECURSOR_DRONE', extra: { mining_off_camera_mod: false, grungle_mod: true, contraband_mod: true } },
            price: 100,
            calculation: [],
        },
        prices: { GRUNGLE: 200000, CONTRABAND: 100000 },
        shouldApply: true,
        expectedPriceChange: 300000 * APPLICATION_WORTH.petItem,
        expectedCalculation: [
            {
                id: 'GRUNGLE',
                type: 'DRONE_MOD',
                price: 200000 * APPLICATION_WORTH.petItem,
                count: 1,
            },
            {
                id: 'CONTRABAND',
                type: 'DRONE_MOD',
                price: 100000 * APPLICATION_WORTH.petItem,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies 1 mod correctly',
        item: {
            petData: { type: 'PRECURSOR_DRONE', extra: { mining_off_camera_mod: true } },
            price: 100,
            calculation: [],
        },
        prices: { MINING_OFF_CAMERA: 200000 },
        shouldApply: true,
        expectedPriceChange: 200000 * APPLICATION_WORTH.petItem,
        expectedCalculation: [
            {
                id: 'MINING_OFF_CAMERA',
                type: 'DRONE_MOD',
                price: 200000 * APPLICATION_WORTH.petItem,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies but no calculation',
        item: {
            petData: { type: 'PRECURSOR_DRONE', extra: { abc_mod: true } },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
    },
    {
        description: 'Does not apply',
        item: {
            petData: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(DroneModsHanler, testCases).runTests();
