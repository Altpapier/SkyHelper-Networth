const PetNetworthHelper = require('../../calculators/helpers/PetNetworthHelper');
const { ValidationError } = require('../../helper/errors');

describe('PetNetworthHelper', () => {
    const mockPetData = {
        type: 'WOLF',
        tier: 'EPIC',
        exp: 100000,
        heldItem: null,
        skin: null,
    };

    describe('constructor', () => {
        test('should create instance with valid pet data', () => {
            const helper = new PetNetworthHelper(mockPetData);
            expect(helper.petData).toBe(mockPetData);
            expect(helper.nonCosmetic).toBe(false);
        });

        test('should throw ValidationError if pet data is invalid', () => {
            expect(() => new PetNetworthHelper(null)).toThrow(ValidationError);
            expect(() => new PetNetworthHelper({})).toThrow(ValidationError);
            expect(() => new PetNetworthHelper({ type: 'WOLF' })).toThrow(ValidationError);
        });
    });

    describe('getTier() and getTierName()', () => {
        test('should return original tier if no tier boost', () => {
            const helper = new PetNetworthHelper(mockPetData);
            expect(helper.getTier()).toBe(3);
            expect(helper.getTierName()).toBe('EPIC');
        });

        test('should return original tier if tier boost present', () => {
            const petWithBoost = { ...mockPetData, heldItem: 'PET_ITEM_TIER_BOOST' };
            const helper = new PetNetworthHelper(petWithBoost);
            expect(helper.getTier()).toBe(3);
            expect(helper.getTierName()).toBe('EPIC');
        });
    });

    describe('getTierBoostedTier() and getTierBoostedTierName()', () => {
        test('should return original tier if no tier boost', () => {
            const helper = new PetNetworthHelper(mockPetData);
            expect(helper.getTierBoostedTier()).toBe(3);
            expect(helper.getTierBoostedTierName()).toBe('EPIC');
        });

        test('should return higher tier if tier boost present', () => {
            const petWithBoost = { ...mockPetData, heldItem: 'PET_ITEM_TIER_BOOST' };
            const helper = new PetNetworthHelper(petWithBoost);
            expect(helper.getTierBoostedTier()).toBe(4);
            expect(helper.getTierBoostedTierName()).toBe('LEGENDARY');
        });
    });

    describe('isSoulbound', () => {
        test('should check if pet is soulbound', () => {
            const helper = new PetNetworthHelper(mockPetData);
            expect(helper.isSoulbound()).toBe(false);
        });
    });

    describe('isCosmetic', () => {
        test('should return true if pet has skin', () => {
            const petWithSkin = { ...mockPetData, skin: 'SKIN' };
            const helper = new PetNetworthHelper(petWithSkin);
            expect(helper.isCosmetic()).toBe(true);
        });

        test('should return false if pet has no skin', () => {
            const helper = new PetNetworthHelper(mockPetData);
            expect(helper.isCosmetic()).toBe(false);
        });
    });

    describe('getPetLevelPrices', () => {
        test('should return base prices for non-skinned pet', () => {
            const helper = new PetNetworthHelper(mockPetData);
            const mockPrices = {
                LVL_1_EPIC_WOLF: 1000,
                LVL_100_EPIC_WOLF: 100000,
            };
            const prices = helper.getPetLevelPrices(mockPrices);
            expect(prices.LVL_1).toBe(1000);
            expect(prices.LVL_100).toBe(100000);
        });
    });

    describe('getPetId', () => {
        test('should return correct pet ID format', () => {
            const helper = new PetNetworthHelper(mockPetData);
            const mockPrices = {
                LVL_100_EPIC_WOLF: 100000,
            };
            expect(helper.getPetId(mockPrices)).toBe('LVL_100_EPIC_WOLF');
        });
    });

    describe('getPetLevel', () => {
        test('should calculate pet level correctly', () => {
            const helper = new PetNetworthHelper(mockPetData);
            const level = helper.getPetLevel();
            expect(level).toHaveProperty('level');
            expect(level).toHaveProperty('xpMax');
            expect(level).toHaveProperty('xp');
            expect(level.xp).toBe(mockPetData.exp);
            expect(level.level).toBe(35);
        });
    });

    describe('getBasePrice', () => {
        test('should return null if required prices are undefined', () => {
            const helper = new PetNetworthHelper(mockPetData);
            const emptyPrices = {};
            helper.getBasePrice(emptyPrices);
            expect(helper.basePrice).toBe(0);
        });

        test('should calculate price correctly for pet level < 100', () => {
            const petData = {
                ...mockPetData,
                exp: 50000, // Lower exp for level < 100
            };
            const helper = new PetNetworthHelper(petData);
            const mockPrices = {
                LVL_1_EPIC_WOLF: 1000,
                LVL_100_EPIC_WOLF: 100000,
            };

            helper.getBasePrice(mockPrices);
            expect(helper.basePrice).toBeGreaterThan(1000);
            expect(helper.basePrice).toBeLessThan(100000);
        });

        test('should calculate price correctly for pet level between 100-200', () => {
            const petData = {
                ...mockPetData,
                type: 'GOLDEN_DRAGON',
                exp: 26353230, // Higher exp for level > 100
            };
            const helper = new PetNetworthHelper(petData);
            const mockPrices = {
                LVL_100_EPIC_GOLDEN_DRAGON: 100000,
                LVL_200_EPIC_GOLDEN_DRAGON: 200000,
            };

            helper.getBasePrice(mockPrices);
            expect(helper.basePrice).toBeGreaterThan(100000);
            expect(helper.basePrice).toBeLessThan(200000);
        });
    });
});
