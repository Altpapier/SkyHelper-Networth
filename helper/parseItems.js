const { decodeItems, decodeItemsObject, decodeItem, decodeToolkit } = require('./decode');
const { createToolkitItem } = require('./functions');

const parseItems = async (profileData, museumData) => {
    const INVENTORY = profileData.inventory;
    const SHARED_INVENTORY = profileData.shared_inventory;
    const outputPromises = {
        armor: INVENTORY?.inv_armor?.data ?? '',
        equipment: INVENTORY?.equipment_contents?.data ?? '',
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

    for (const [i, layout] of Object.entries(profileData.loadout?.armor || {})) {
        outputPromises[`wardrobe_${i}_helmet`] = layout.HELMET?.data ?? '';
        outputPromises[`wardrobe_${i}_chestplate`] = layout.CHESTPLATE?.data ?? '';
        outputPromises[`wardrobe_${i}_leggings`] = layout.LEGGINGS?.data ?? '';
        outputPromises[`wardrobe_${i}_boots`] = layout.BOOTS?.data ?? '';
    }

    for (const [i, layout] of Object.entries(profileData.loadout?.equipment || {})) {
        outputPromises[`equipment_${i}_1`] = layout.EQUIPMENT_SLOT_1?.data ?? '';
        outputPromises[`equipment_${i}_2`] = layout.EQUIPMENT_SLOT_2?.data ?? '';
        outputPromises[`equipment_${i}_3`] = layout.EQUIPMENT_SLOT_3?.data ?? '';
        outputPromises[`equipment_${i}_4`] = layout.EQUIPMENT_SLOT_4?.data ?? '';
    }

    const entries = Object.entries(outputPromises);
    const decodedItems = await decodeItems(entries.map(([_, value]) => value));

    const items = entries.reduce((acc, [key, _], idx) => {
        if (!decodedItems[idx]) {
            acc[key] = [];
            return acc;
        }

        const filteredItems = decodedItems[idx].filter((item) => item && Object.keys(item).length);
        if (key.includes('storage')) {
            acc.storage = (acc.storage || []).concat(filteredItems);
        } else if (key.startsWith('wardrobe_')) {
            acc.wardrobe = (acc.wardrobe || []).concat(filteredItems);
        } else if (key.startsWith('equipment_')) {
            acc.equipment = (acc.equipment || []).concat(filteredItems);
        } else {
            acc[key] = filteredItems;
        }

        return acc;
    }, {});

    items.storage ??= [];
    items.wardrobe ??= [];

    if (museumData && Object.keys(museumData).length > 0 && museumData.items && Object.keys(museumData.items).length > 0) {
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

    items.farming_toolkit ??= [];
    if (profileData.garden_player_data?.farming_toolkit?.IS_UNLOCKED) {
        const farmingToolkit = profileData.garden_player_data.farming_toolkit ?? {};
        // prettier-ignore
        const cropIds = Array.from(
            new Set([
                ...Object.keys(farmingToolkit.IN_USE ?? {}),
                ...Object.keys(farmingToolkit)
            ]),
        ).filter((key) => key !== 'IN_USE' && key !== 'IS_UNLOCKED');

        for (const cropId of cropIds) {
            for (const [index, farmingTool] of Object.entries(farmingToolkit[cropId] || {})) {
                const inUse = farmingToolkit.IN_USE[cropId];
                if (!inUse || inUse[index] !== false) {
                    continue;
                }

                if (!farmingTool?.data) {
                    continue;
                }

                const decodedFarmingTool = await decodeToolkit(farmingTool.data);
                const item = createToolkitItem(decodedFarmingTool);
                items.farming_toolkit.push(item);
            }
        }
    }

    items.hunting_toolkit ??= [];
    if (profileData.foraging?.hunting_toolkit?.IS_UNLOCKED) {
        const huntingToolkit = profileData.foraging.hunting_toolkit ?? {};
        // prettier-ignore
        const huntingToolkitItems = Array.from(
            new Set([
                ...Object.keys(huntingToolkit),
                ...Object.keys(huntingToolkit.IN_USE ?? {}),
            ]),
        ).filter((key) => key !== 'IN_USE' && key !== 'IS_UNLOCKED');

        for (const huntingToolkitItem of huntingToolkitItems) {
            for (const [index, huntingTool] of Object.entries(huntingToolkit[huntingToolkitItem] || {})) {
                const inUse = huntingToolkit.IN_USE[huntingToolkitItem];
                if (!inUse || inUse[index] !== false) {
                    continue;
                }

                if (!huntingTool?.data) {
                    continue;
                }

                const decodedHuntingTool = await decodeToolkit(huntingTool.data);
                const item = createToolkitItem(decodedHuntingTool);
                items.hunting_toolkit.push(item);
            }
        }
    }

    await postParseItems(profileData, items);
    return items;
};

const postParseItems = async (profileData, items) => {
    // Parse Cake Bags - Process all items in a single loop
    const processCakeBags = async (items) => {
        for (const categoryItems of Object.values(items)) {
            for (const item of categoryItems) {
                if (!item?.tag?.ExtraAttributes?.new_year_cake_bag_data) {
                    continue;
                }

                const cakeBagData = await decodeItem(Buffer.from(item.tag.ExtraAttributes.new_year_cake_bag_data, 'base64'));
                item.tag.ExtraAttributes.new_year_cake_bag_years = cakeBagData
                    .filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake)
                    .map((cake) => cake.tag.ExtraAttributes.new_years_cake);
            }
        }
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
