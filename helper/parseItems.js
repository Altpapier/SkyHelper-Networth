const { decodeItems, decodeItem } = require('./decode');

const parseItems = async (profileData, museumData, options = { removeEmptyItems: true, combineStorage: true, additionalInventories: null }) => {
    const INVENTORY = profileData.inventory ?? {};
    const SHARED_INVENTORY = profileData.shared_inventory ?? {};

    const outputPromises = {
        armor: INVENTORY.inv_armor?.data ?? '',
        equipment: INVENTORY.equipment_contents?.data ?? '',
        wardrobe: INVENTORY.wardrobe_contents?.data ?? '',
        inventory: INVENTORY.inv_contents?.data ?? '',
        enderchest: INVENTORY.ender_chest_contents?.data ?? '',
        accessories: INVENTORY.bag_contents?.talisman_bag?.data ?? '',
        personal_vault: INVENTORY.personal_vault_contents?.data ?? '',
        fishing_bag: INVENTORY.bag_contents?.fishing_bag?.data ?? '',
        potion_bag: INVENTORY.bag_contents?.potion_bag?.data ?? '',
        sacks_bag: INVENTORY.bag_contents?.sacks_bag?.data ?? '',
        candy_inventory: SHARED_INVENTORY.candy_inventory_contents?.data ?? '',
        carnival_mask_inventory: SHARED_INVENTORY.carnival_mask_inventory_contents?.data ?? '',
        quiver: INVENTORY.bag_contents?.quiver?.data ?? '',
        ...Object.fromEntries([
            ...Object.entries(INVENTORY?.backpack_contents ?? {}).map(([key, value]) => [`storage_${key}`, value.data ?? '']),
            ...Object.entries(INVENTORY?.backpack_icons ?? {}).map(([key, value]) => [`storage_icon_${key}`, value.data ?? '']),
        ]),
        ...(options.additionalInventories ?? {}),
    };

    const entries = Object.entries(outputPromises);
    const decodedItems = await decodeItems(entries.map(([_, value]) => value));

    const items = {};
    if (options.combineStorage) {
        items.storage = [];
    }

    entries.forEach(([key, _], idx) => {
        if (!decodedItems[idx]) {
            items[key] = [];
            return;
        }

        const filteredItems = options.removeEmptyItems ? decodedItems[idx].filter((item) => item && Object.keys(item).length) : decodedItems[idx];
        if (key.includes('storage') && options.combineStorage) {
            items.storage = items.storage.concat(filteredItems);
        } else {
            items[key] = filteredItems;
        }
    });

    if (museumData?.items && Object.keys(museumData.items ?? {}).length > 0) {
        const firstItem = Object.values(museumData.items)[0];

        if (firstItem?.items?.length && museumData.special?.length) {
            items.museum = [
                ...Object.values(museumData.items)
                    .filter((item) => !item.borrowing)
                    .flatMap((item) => item.items),
                ...museumData.special.flatMap((special) => special.items),
            ];
        } else {
            const specialItemsData = museumData.special?.map((special) => special.items.data) ?? [];

            const museumItemsData = Object.values(museumData.items ?? {})
                .filter((item) => !item.borrowing)
                .map((item) => item.items.data);

            const [decodedMuseumItems, decodedSpecialItems] = await Promise.all([decodeItems(museumItemsData), decodeItems(specialItemsData)]);

            items.museum = [...decodedMuseumItems.flat(), ...decodedSpecialItems.flat()];
        }
    } else {
        items.museum = [];
    }

    await postParseItems(profileData, items);
    return items;
};

const postParseItems = async (profileData, items) => {
    const allItems = Object.values(items)
        .filter(Array.isArray)
        .flat()
        .filter((item) => item?.tag?.ExtraAttributes?.new_year_cake_bag_data);

    await Promise.all([
        (async () => {
            for (const item of allItems) {
                const cakeBagData = await decodeItem(Buffer.from(item.tag.ExtraAttributes.new_year_cake_bag_data, 'base64'));
                item.tag.ExtraAttributes.new_year_cake_bag_years = cakeBagData
                    .filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake)
                    .map((cake) => cake.tag.ExtraAttributes.new_years_cake);
            }
        })(),
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
                ? Object.entries(profileData.currencies.essence).map(([id, data]) => {
                      return {
                          id: `ESSENCE_${id.toUpperCase()}`,
                          amount: data.current,
                      };
                  })
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
