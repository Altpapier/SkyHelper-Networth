const { decodeItems, decodeItemsObject, decodeItem } = require('./decode');

const parseItems = async (profileData, museumData) => {
    const INVENTORY = profileData.inventory;
    const SHARED_INVENTORY = profileData.shared_inventory;
    const outputPromises = {
        armor: INVENTORY?.inv_armor?.data ?? '',
        equipment: INVENTORY?.equipment_contents?.data ?? '',
        wardrobe: INVENTORY?.wardrobe_contents?.data ?? '',
        inventory: INVENTORY?.inv_contents?.data ?? '',
        enderchest: INVENTORY?.ender_chest_contents?.data ?? '',
        accessories: INVENTORY?.bag_contents?.talisman_bag?.data ?? '',
        personal_vault: INVENTORY?.personal_vault_contents?.data ?? '',
        fishing_bag: INVENTORY?.bag_contents?.fishing_bag?.data ?? '',
        potion_bag: INVENTORY?.bag_contents?.potion_bag?.data ?? '',
        sacks_bag: INVENTORY?.bag_contents?.sacks_bag?.data ?? '',
        candy_inventory: SHARED_INVENTORY?.candy_inventory_contents?.data ?? '',
        carnival_mask_inventory: SHARED_INVENTORY?.carnival_mask_inventory_contents?.data ?? '',
        quiver: INVENTORY?.bag_contents?.quiver?.data ?? '',

        ...Object.fromEntries([
            ...Object.entries(INVENTORY?.backpack_contents ?? {}).map(([key, value]) => [`storage_${key}`, value.data ?? '']),
            ...Object.entries(INVENTORY?.backpack_icons ?? {}).map(([key, value]) => [`storage_icon_${key}`, value.data ?? '']),
        ]),
    };

    const entries = Object.entries(outputPromises);
    const decodedItems = await decodeItems(entries.map(([_, value]) => value));

    const items = entries.reduce((acc, [key, _], idx) => {
        if (!decodedItems[idx]) return acc;

        const filteredItems = decodedItems[idx].filter((item) => item && Object.keys(item).length);

        if (key.includes('storage')) {
            acc.storage = (acc.storage || []).concat(filteredItems);
        } else {
            acc[key] = filteredItems;
        }

        return acc;
    }, {});

    items.storage ??= [];

    if (museumData && museumData.items) {
        if (Object.values(museumData.items).at(0).items.length && museumData.special.length) {
            items.museum = [
                ...Object.values(museumData.items)
                    .filter((item) => !item.borrowing)
                    .map((item) => item.items)
                    .flat(),
                ...museumData.special.map((special) => special.items).flat(),
            ];
        } else {
            const specialItems = museumData.special?.map((special) => special.items.data) ?? [];
            const [decodedMuseumItems, decodedSpecialItems] = await Promise.all([
                decodeItemsObject(
                    Object.fromEntries(
                        Object.entries(museumData.items || {})
                            .filter(([_, value]) => !value.borrowing)
                            .map(([key, value]) => [key, value.items.data]),
                    ),
                ),
                decodeItems(specialItems),
            ]);

            items.museum = [...Object.values(decodedMuseumItems).flat(), ...decodedSpecialItems.flat()];
        }
    } else {
        items.museum ??= [];
    }

    await postParseItems(profileData, items);
    return items;
};

const postParseItems = async (profileData, items) => {
    // Parse Cake Bags - Process all items in a single loop
    const processCakeBags = async (items) => {
        const promises = [];
        for (const categoryItems of Object.values(items)) {
            for (const item of categoryItems) {
                if (item?.tag?.ExtraAttributes?.new_year_cake_bag_data) {
                    promises.push(
                        decodeItem(item.tag.ExtraAttributes.new_year_cake_bag_data).then((cakes) => {
                            item.tag.ExtraAttributes.new_year_cake_bag_years = cakes
                                .filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake)
                                .map((cake) => cake.tag.ExtraAttributes.new_years_cake);
                        }),
                    );
                }
            }
        }
        await Promise.all(promises);
    };

    await Promise.all([
        processCakeBags(items),
        (() => {
            const sacksData = profileData.sacks_counts || profileData.inventory?.sacks_counts;
            items.sacks = sacksData
                ? Object.entries(sacksData)
                      .filter(([_, amount]) => amount)
                      .map(([id, amount]) => ({ id, amount }))
                : [];
        })(),
        (() => {
            items.essence = profileData.currencies?.essence
                ? Object.entries(profileData.currencies.essence).map(([id, data]) => ({
                      id: `ESSENCE_${id}`,
                      amount: data.current,
                  }))
                : [];
        })(),
        (() => {
            items.pets = profileData.pets_data?.pets?.map((pet) => ({ ...pet })) ?? [];
        })(),
    ]);
};

module.exports = {
    parseItems,
    postParseItems,
};
