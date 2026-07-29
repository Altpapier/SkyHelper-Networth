const { decodeNbtData } = require('../../helper/decode');
const { parseToolkit } = require('../../helper/toolkits');

jest.mock('../../helper/decode', () => ({
    decodeNbtData: jest.fn(),
}));

describe('parseToolkit', () => {
    beforeEach(() => {
        decodeNbtData.mockImplementation(async (data) => ({ id: data.toUpperCase() }));
    });

    it('counts slots unless they are explicitly marked as in use', async () => {
        const toolkit = {
            IS_UNLOCKED: true,
            MISSING_CATEGORY: {
                0: { data: 'missing-category' },
            },
            EMPTY_CATEGORY: {
                0: { data: 'empty-category' },
            },
            MIXED_CATEGORY: {
                0: { data: 'not-in-use' },
                1: { data: 'in-use' },
                2: { data: 'missing-slot' },
            },
            IN_USE: {
                EMPTY_CATEGORY: {},
                MIXED_CATEGORY: {
                    0: false,
                    1: true,
                },
            },
        };

        const items = await parseToolkit(toolkit);

        expect(items.map((item) => item.tag.ExtraAttributes.id)).toEqual(['MISSING-CATEGORY', 'EMPTY-CATEGORY', 'NOT-IN-USE', 'MISSING-SLOT']);
        expect(decodeNbtData).not.toHaveBeenCalledWith('in-use');
    });
});
