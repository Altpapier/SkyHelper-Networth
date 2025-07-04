const { parseItems, postParseItems } = require('../../helper/parseItems');

describe('parseItems', () => {
    const rawItem = [
        {
            id: 397,
            Count: 1,
            tag: {
                HideFlags: 254,
                SkullOwner: {
                    Id: 'bbc7c4a1-3981-3205-8a61-0f40598cee4c',
                    Properties: {
                        textures: [
                            {
                                Value: 'eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWZmZjlkMzQ4ZWJjZGE2Njc0NzE5MjU1NGMzNzhhZDdmMTJmZTRmNmQ3OWNiYzYyZDRkZmI2NjY5NzFlMmJmIn19fQ==',
                            },
                        ],
                    },
                },
                display: {
                    Lore: [
                        '§7Holds and shoots Snowballs. When',
                        '§7you pickup Snowballs, they increase',
                        '§7the ammo held by this item.',
                        '',
                        '§7Snowballs: §f962§7/§f1,000',
                        '',
                        '§eRight click to shoot!',
                        '',
                        '§9§lRARE',
                    ],
                    Name: '§9Frosty the Snow Cannon',
                },
                ExtraAttributes: { ammo: 962, id: 'SNOW_CANNON', uuid: 'bc1826e1-c7ee-4b3c-a34c-74b1bc4c9515', donated_museum: 1, timestamp: 1670091180000 },
            },
            Damage: 3,
        },
    ];
    const encodedItem =
        'H4sIAAAAAAAAAE2SzW7aQBDHh480QKX22l6qrVr1FFIbbD4q5YAICUbBFEhC8CVarwds2LWRvW5izr32OXiBPgFv0VufpOqSSm0vq53//Gb/M6upAJQhF1QAIJeHfODlvuXgqBulocxVoCDpsgDlfuDhBafLRFG/KlCZrlPORw8hxiXIWx68d13WZAbVq/V2Sx01zay2aEOvagtDM9sthmgwVfc5jjYYywCTMpQkPso0xuTJugRHt5SnCN8xG2jOna95dwPOMquh4uupxkfWatO0wtvM7VoNS6h8v9O4ytr/saakM5PP6wPfCcepK261q/qEY3+iM3HzZThzhLPi6+F2bDizwcq57NXsFdPsbc8crm50+3K4tbe+75x7Yng9EM71RNhiXB/N7GC+nWfO+WTtCEvVzE17e8GHYiCsUG8vxmdnaoIKHHtBsuE0K0PxKoqxBIeffbffNfsR9xJCQ48kfhTJhEzD6MGlnCenZOZjCB8UlEUp2QRsnW7+pU+I9DEjQchipAnCG8UphVAhIuIj94ibKSRISCBRnCpDooi/5Z9UtGg3akr7qG76iaZpinm13+EkWPqSMK4MiYz+9PX2MMV+197v+KQz6ZWgaFOB8FpJF3GUyIMVPjVHujQMo1DN/LL3KGPakTIO3FRiUoDioTmAwr50WCZ4PrVHs/tux7ZHtnoxTYPDtjC9VWugXmVNxKrh1lmV1g1WbRqu7jKDtU3dzMELLwqpRO9epAmmIleEsgwEJpKKjdqYrz/0458AeXh2TgVdIhQAfgPNrbz6zQIAAA==';

    it('should parse empty profile data', async () => {
        const profileData = {};
        const items = await parseItems(profileData);

        expect(items).toEqual({
            accessories: [],
            armor: [],
            candy_inventory: [],
            carnival_mask_inventory: [],
            enderchest: [],
            equipment: [],
            essence: [],
            fishing_bag: [],
            inventory: [],
            museum: [],
            personal_vault: [],
            pets: [],
            potion_bag: [],
            quiver: [],
            sacks: [],
            sacks_bag: [],
            storage: [],
            wardrobe: [],
        });
    });

    it('should handle backpack contents and icons', async () => {
        const profileData = {
            inventory: {
                inv_armor: { data: encodedItem },
            },
        };

        const items = await parseItems(profileData);

        // ? NOTE: Needed because SignedBigInt [] cannot be declared directly in the test
        items.armor[0].tag.ExtraAttributes.timestamp = 1670091180000;

        expect(items.armor).toEqual(rawItem);
        expect(items.inventory).toEqual([]);
        expect(items.storage).toEqual([]);
    });

    it('should parse museum data', async () => {
        const profileData = {};
        const museumData = {
            items: {
                0: {
                    items: { data: encodedItem },
                    borrowing: false,
                },
            },
            special: [
                {
                    items: { data: encodedItem },
                },
            ],
        };

        const items = await parseItems(profileData, museumData);

        // ? NOTE: Needed because SignedBigInt [] cannot be declared directly in the test
        items.museum[0].tag.ExtraAttributes.timestamp = 1670091180000;
        items.museum[1].tag.ExtraAttributes.timestamp = 1670091180000;

        const museumItem = rawItem[0];
        expect(items.museum).toEqual([museumItem, museumItem]);
    });

    it('should allow already parsed museum items', async () => {
        const profileData = {};
        const museumData = {
            items: {
                0: {
                    items: rawItem,
                    borrowing: false,
                },
            },
            special: [
                {
                    items: rawItem,
                },
            ],
        };

        const items = await parseItems(profileData, museumData);

        const museumItem = rawItem[0];
        expect(items.museum).toEqual([museumItem, museumItem]);
    });
});

describe('postParseItems', () => {
    const profileData = {
        sacks_counts: {
            STONE: 100,
            OAK_LOG: 69420,
            DIRT: 420,
        },
        currencies: {
            essence: {
                gold: {
                    current: 420,
                },
            },
        },
        pets_data: {
            pets: [
                {
                    type: 'WOLF',
                    tier: 'LEGENDARY',
                    exp: 100000,
                    heldItem: null,
                    skin: null,
                },
            ],
        },
    };

    const items = {
        inventory: [
            {
                id: 397,
                Count: 1,
                tag: {
                    ExtraAttributes: {
                        new_year_cake_bag_data: JSON.parse(
                            '[31,-117,8,0,0,0,0,0,0,0,-19,-101,93,-117,27,71,22,-122,-37,118,-78,107,15,36,-39,92,46,-7,64,11,123,-79,123,113,-104,-6,56,85,117,-54,119,-109,-55,36,89,54,107,-116,-67,-112,-51,-43,112,78,125,-116,-123,-57,51,65,35,39,-15,47,-14,-1,-16,15,11,57,109,72,-64,9,61,-40,75,-93,113,-122,-106,-112,104,85,55,45,-95,71,-17,121,-33,83,-43,-38,27,-122,59,-61,-115,-11,-34,48,12,-15,-26,112,115,93,111,-56,-115,-31,-35,-61,-13,-89,103,-37,27,123,-61,-83,45,-97,-36,25,-34,105,103,-27,-47,48,-34,110,13,119,-66,90,-41,-10,-59,41,-97,92,-24,-53,-97,-10,-122,63,-41,-11,-59,119,-89,-4,76,-113,-6,-6,124,-45,110,-21,-24,-69,-61,39,47,-98,-89,47,-41,-33,-73,-77,-43,-10,124,-43,-66,111,-101,103,-85,-15,-104,-74,89,-15,-59,-118,-121,-113,116,119,105,-89,77,54,-68,93,-97,-97,-83,-6,-7,102,-75,125,-44,86,-103,-74,-113,-122,15,117,-25,-61,-57,-49,62,59,61,47,-113,87,-49,26,111,-2,-90,-89,124,-17,-59,-13,-14,-30,-7,-23,-61,-5,71,-121,-1,58,-8,-6,-10,-16,-50,61,126,-46,-58,-73,-47,-47,114,-81,-3,-80,-6,86,15,92,29,-14,-29,-74,-6,-57,-53,-51,76,-1,28,-10,-122,15,-114,126,-36,110,-8,96,-69,-35,-84,-27,-23,-74,93,-36,26,-34,63,107,63,28,-113,103,-67,56,46,122,-76,-98,90,110,15,119,-50,55,-21,-109,-11,-39,127,-7,100,-8,-21,-125,-93,111,14,30,124,126,124,-17,-24,-101,-29,111,-113,14,30,60,60,62,60,-8,-9,-47,-15,-67,-5,-121,-73,-57,47,103,120,-17,-105,29,47,-57,-11,-125,60,125,-86,-93,127,-57,40,38,-79,113,-32,-71,26,-64,-28,43,16,121,15,41,-28,-20,-117,-55,-100,37,-21,-5,108,-41,79,-38,-59,-106,-97,124,55,-4,-59,-102,125,-105,-9,-99,89,-47,-35,-112,86,-9,-1,51,12,55,-121,63,125,-50,79,-8,100,-4,80,11,-119,-1,-105,-124,16,-39,-50,41,66,-117,-42,1,-26,98,-128,24,11,-124,104,-100,24,41,-70,93,39,72,-28,-69,6,23,18,-77,-111,40,-75,39,-61,104,33,122,-14,-128,-28,13,-80,37,6,-25,-83,113,37,-25,74,-91,76,-110,8,-26,-83,35,65,-13,-111,-96,-41,38,-15,-65,57,72,-80,-119,-35,-9,-22,-128,71,97,32,-10,10,-39,-121,8,-82,50,82,70,95,99,112,-81,-112,120,63,-17,-45,-56,1,-57,-38,116,-16,-106,113,-8,-29,42,-62,-77,-75,-123,-72,65,-54,25,1,-59,86,16,-113,6,66,-23,-50,118,-17,-93,51,50,93,-101,-4,91,-89,-120,63,46,-119,-32,-107,69,-94,8,33,-123,6,-24,48,67,-74,44,-48,117,-84,37,-106,-38,114,-101,36,-31,104,33,49,-97,38,34,-94,-91,-108,-12,-5,-41,-48,-124,-115,50,-120,75,5,76,14,-87,58,-116,-99,-40,77,107,98,33,49,31,-119,90,-125,21,73,1,58,-117,102,88,-93,-123,-119,76,66,-32,66,-35,117,27,76,114,83,-102,-48,12,27,22,18,-77,-111,48,92,124,-53,21,-63,39,-57,-128,-43,68,96,17,-75,-17,20,-84,-51,-87,-94,-13,125,-102,-60,-94,-119,25,-5,-70,-30,-117,84,19,0,-117,75,-22,-40,-87,1,71,-107,72,116,49,22,-117,38,-58,56,-43,-41,105,-122,-75,11,-119,-39,72,116,113,78,-102,42,33,119,-19,-26,-80,21,11,-92,70,13,-51,118,-101,-79,-87,-115,-25,-91,-61,-34,13,9,-17,-87,33,59,117,-20,-79,58,113,-10,-112,-111,-76,-71,-109,30,-109,75,-35,4,31,22,-97,-40,5,9,46,-40,56,104,97,-86,-47,101,-64,-64,30,-92,-23,75,23,-116,-6,69,-58,-18,-94,93,72,-20,36,59,101,49,-107,-110,-128,-21,97,-84,78,-119,64,-110,-30,-88,-62,36,18,123,-49,121,-118,68,-66,107,-105,89,-89,-7,72,-112,-89,-40,-57,20,43,14,-43,-79,-85,22,38,9,-52,-96,-113,-38,-126,-53,73,-31,76,107,34,46,36,102,35,17,-91,-39,-110,77,-125,90,-86,106,2,-39,2,123,111,32,-116,-51,-73,99,68,-105,-52,-101,84,-89,-35,-79,-8,120,-126,-123,53,-18,-84,-66,9,-116,79,-89,97,-24,-71,94,-105,70,-97,-59,-75,115,-24,65,-45,42,-112,-93,14,-40,123,5,-62,96,-75,86,-71,64,-47,-78,118,127,-81,118,119,31,90,-69,111,95,-46,-80,118,20,-58,85,77,3,94,71,24,70,127,-3,38,104,-125,-25,-118,-31,81,26,-84,17,42,55,-107,-122,-74,-35,41,85,-97,106,-97,-126,-31,-18,-122,-85,-101,9,-68,-114,48,98,28,39,1,67,-128,92,92,5,-92,40,64,61,105,-68,-59,100,-87,-118,19,-12,102,26,-122,-71,-70,38,-17,58,-62,-24,-74,-59,18,-102,-125,-120,-34,1,-70,38,26,105,51,66,13,73,-116,-58,-86,-32,127,19,-92,94,-123,113,117,-85,70,-41,17,-122,75,-74,86,-108,-82,122,96,2,-116,-38,125,75,44,6,82,52,-66,16,-119,-57,94,23,24,59,-126,-111,123,106,-91,123,-127,110,-69,122,-122,-81,26,113,-123,3,116,99,109,113,-46,-68,-23,-18,18,3,15,-117,-127,-49,-23,25,-87,-108,-114,82,65,55,84,25,54,54,-32,-116,-22,25,100,122,46,-24,-56,6,127,9,12,90,96,-52,-87,-116,32,86,76,87,-89,-24,-67,41,-116,-46,65,-86,-87,-64,-62,-59,53,100,-76,33,95,-110,-90,-106,50,53,39,-116,98,-39,101,-19,52,32,-122,-96,101,-86,117,15,-39,70,-126,-122,-50,5,65,110,78,-62,82,-90,118,4,-93,101,118,30,75,3,125,-118,-128,-95,33,-120,69,-19,-61,109,14,17,51,123,-28,-72,-64,-40,89,7,-82,119,14,-102,101,-117,104,-103,-62,-90,29,-121,-83,17,-102,-70,56,-79,-83,-58,102,-102,46,83,-2,-22,-106,48,-82,35,-116,-100,-56,32,102,-11,110,-97,-5,120,113,-38,56,97,72,-102,-90,58,18,81,69,75,125,-78,-23,91,12,124,102,24,-87,82,99,-101,24,122,70,37,34,37,67,78,-94,-98,-47,99,-22,-88,85,-118,-6,82,-90,118,5,-93,50,-71,40,-123,53,-38,-110,81,121,116,77,83,-91,20,109,-61,-117,-87,61,-58,-18,-22,101,6,-66,76,20,-50,9,67,52,54,5,91,60,24,-105,-100,122,-122,83,101,-12,94,-96,122,-118,73,-48,72,23,-98,-10,12,123,117,-53,25,-41,17,-122,-49,9,-77,-43,32,101,-100,22,39,36,54,64,45,59,-16,-59,75,48,-75,-40,38,-109,83,-24,-53,116,-56,-36,-98,-31,-67,-73,99,-102,-14,-114,-58,21,87,27,-128,-126,-79,80,-126,-85,92,34,73,13,-53,68,-31,-50,-42,51,-88,91,43,81,-64,-9,16,0,-57,43,-92,-56,84,6,35,-91,-87,-123,-77,-73,17,47,-127,-111,23,24,115,70,-37,-30,114,-115,70,-96,-113,-51,55,-10,-110,64,114,-16,-32,82,100,-31,106,77,-117,-105,25,-8,-17,-93,-19,47,-73,-85,94,10,39,-65,121,35,38,-105,-3,1,-61,-65,46,-110,-121,-77,32,113,70,-88,-87,62,-100,41,-93,-115,23,2,78,-22,28,-127,-110,47,57,-40,-38,-22,-85,1,-9,3,-38,-73,-2,-41,107,-41,-90,-128,12,63,3,-82,88,-88,-112,-67,55,0,0]',
                        ),
                    },
                },
            },
        ],
    };

    it('should parse cake bag', async () => {
        await postParseItems(profileData, items);

        expect(items.inventory[0].tag.ExtraAttributes.new_year_cake_bag_years).toEqual([
            98, 98, 98, 88, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102, 102,
            83,
        ]);
    });

    it('should parse sacks', async () => {
        await postParseItems(profileData, items);

        expect(items.sacks).toEqual([
            { id: 'STONE', amount: 100 },
            { id: 'OAK_LOG', amount: 69420 },
            { id: 'DIRT', amount: 420 },
        ]);
    });

    it('should parse essence', async () => {
        await postParseItems(profileData, items);

        expect(items.essence).toEqual([{ id: 'ESSENCE_GOLD', amount: 420 }]);
    });

    it('should parse pets', async () => {
        await postParseItems(profileData, items);

        expect(items.pets).toEqual([
            {
                type: 'WOLF',
                tier: 'LEGENDARY',
                exp: 100000,
                heldItem: null,
                skin: null,
            },
        ]);
    });

    it('should handle missing data', async () => {
        const items = {};
        await postParseItems({}, items);

        expect(items.sacks).toEqual([]);
        expect(items.essence).toEqual([]);
        expect(items.pets).toEqual([]);
    });
});
