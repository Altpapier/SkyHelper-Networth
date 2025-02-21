const { decodeItems, decodeItemsObject, decodeItem } = require('./decode');

const singleContainers = {
    armor: 'inv_armor',
    equipment: 'equipment_contents',
    wardrobe: 'wardrobe_contents',
    inventory: 'inv_contents',
    enderchest: 'ender_chest_contents',
    accessories: 'talisman_bag',
    personal_vault: 'personal_vault_contents',
    fishing_bag: 'fishing_bag',
    potion_bag: 'potion_bag',
    sacks_bag: 'sacks_bag',
    candy_inventory: 'candy_inventory_contents',
    carnival_mask_inventory: 'carnival_mask_inventory_contents',
};

const bagContainers = ['fishing_bag', 'potion_bag', 'talisman_bag', 'sacks_bag']; // In the v2 endpoint: profileData.inventory.bag_contents
const sharedContainers = ['candy_inventory_contents', 'carnival_mask_inventory_contents']; // In the v2 endpoint: profileData.shared_inventory

const parseItems = async (profileData, museumData) => {
    const INVENTORY = profileData.inventory;
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
        candy_inventory: INVENTORY?.candy_inventory_contents?.data ?? '',
        carnival_mask_inventory: INVENTORY?.carnival_mask_inventory_contents?.data ?? '',
        quiver: INVENTORY?.bag_contents?.quiver?.data ?? '',

        ...Object.entries(INVENTORY?.backpack_contents ?? {}).reduce((acc, [key, value]) => {
            acc[`storage_${key}`] = value.data ?? '';
            return acc;
        }, {}),
        ...Object.entries(INVENTORY?.backpack_icons ?? {}).reduce((acc, [key, value]) => {
            acc[`storage_icon_${key}`] = value.data ?? '';
            return acc;
        }, {}),
    };

    const entries = Object.entries(outputPromises);
    const values = entries.map(([_, value]) => value);
    const decodedItems = await decodeItems(values);
    const newItems = await Promise.all(
        entries.map(async ([key, _], idx) => {
            if (!decodedItems[idx]) {
                return [key, []];
            }

            if (key.includes('storage')) {
                return;
            }

            return [key, decodedItems[idx].filter((item) => item && Object.keys(item).length)];
        }),
    );

    const items = {};
    for (const [key, value] of newItems.filter((x) => x)) {
        if (key.includes('storage')) {
            items.storage ??= [];
            items.storage.push(value);
        } else {
            items[key] = value;
        }
    }

    const specialItems = museumData.special ? museumData.special.map((special) => special.items.data) : [];
    const museumItems = museumData.items ? Object.fromEntries(Object.entries(museumData.items).map(([key, value]) => [key, value.items.data])) : {};

    const [decodedmuseumItems, decodedSpecialItems] = await Promise.all([decodeItemsObject(museumItems), decodeItems(specialItems)]);

    items.museum = [];
    for (const value of Object.values(decodedmuseumItems)) {
        items.museum.push(...value);
    }

    for (const value of decodedSpecialItems) {
        items.museum.push(...value);
    }

    await postParseItems(profileData, items);

    return items;
};

const postParseItems = async (profileData, items) => {
    // Parse Cake Bags
    for (const categoryItems of Object.values(items)) {
        for (const item of categoryItems) {
            if (!item?.tag?.ExtraAttributes?.new_year_cake_bag_data) continue;
            const cakes = await decodeItem(item.tag?.ExtraAttributes?.new_year_cake_bag_data);
            if (item?.tag?.ExtraAttributes) {
                item.tag.ExtraAttributes.new_year_cake_bag_years = cakes
                    .filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake)
                    .map((cake) => cake.tag.ExtraAttributes.new_years_cake);
            }
        }
    }

    // Parse Sacks
    items.sacks = [];
    if (profileData.sacks_counts || profileData.inventory?.sacks_counts) {
        for (const [id, amount] of Object.entries(profileData.sacks_counts || profileData.inventory.sacks_counts)) {
            if (amount) items.sacks.push({ id, amount });
        }
    }

    // Parse Essence
    items.essence = [];
    if (profileData.currencies?.essence) {
        for (const id of Object.keys(profileData.currencies?.essence)) {
            items.essence.push({ id: `ESSENCE_${id}`, amount: profileData.currencies.essence[id]?.current });
        }
    }

    // Parse Pets
    items.pets = [];
    if (profileData.pets || profileData.pets_data?.pets) {
        for (const pet of profileData.pets_data.pets) {
            items.pets.push({ ...pet });
        }
    }
};

module.exports = {
    parseItems,
    postParseItems,
};
