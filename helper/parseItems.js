const { decodeItems, decodeItem } = require('./decode');

const parseItems = async (profileData, museumData, options = { removeEmptyItems: true, combineStorage: true, additionalInventories: null }) => {
    // Prepare data
    const INVENTORY = profileData.inventory ?? {};
    const SHARED_INVENTORY = profileData.shared_inventory ?? {};

    // Setup inventory data
    const rawData = {
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

    // Decode data
    const decodedItems = await decodeItems(Object.values(rawData));

    // Prepare return object
    const items = {};
    if (options.combineStorage) {
        items.storage = [];
    }

    // Loop through inventories
    Object.keys(rawData).forEach((key, idx) => {
        let currentInventoryItems = decodedItems[idx];
        // If empty, skip
        if (!currentInventoryItems) {
            items[key] = [];
            return;
        }

        // Filter empty items
        if (options.removeEmptyItems) {
            currentInventoryItems = currentInventoryItems.filter((item) => item && Object.keys(item).length);
        }

        // Add to return object, combining storage if requested
        if (key.includes('storage') && options.combineStorage) {
            items.storage = items.storage.concat(currentInventoryItems);
        } else {
            items[key] = currentInventoryItems;
        }
    });

    // If we have museum data, decode it
    if (museumData?.items && Object.keys(museumData.items ?? {}).length > 0) {
        // Check whether museum items are already decoded, if so skip decoding
        const firstItem = Object.values(museumData.items)[0];
        if (firstItem?.items?.length && museumData.special?.length) {
            // Filter out borrowing items and flatten the arrays
            items.museum = [
                ...Object.values(museumData.items)
                    .filter((item) => !item.borrowing)
                    .flatMap((item) => item.items),
                ...museumData.special.flatMap((special) => special.items),
            ];
        } else {
            // Prepare special items data
            const specialItemsData = museumData.special?.map((special) => special.items.data) ?? [];

            // Filter out borrowing items and prepare the items
            const museumItemsData = Object.values(museumData.items ?? {})
                .filter((item) => !item.borrowing)
                .map((item) => item.items.data);

            // Decode the items
            const [decodedMuseumItems, decodedSpecialItems] = await Promise.all([decodeItems(museumItemsData), decodeItems(specialItemsData)]);

            // Put the decoded items into the return object
            items.museum = [...decodedMuseumItems.flat(), ...decodedSpecialItems.flat()];
        }
    } else {
        items.museum = [];
    }

    // Post process the inventories and return it
    await postParseItems(profileData, items);
    return items;
};

const postParseItems = async (profileData, items) => {
    // Process new year cake bags
    await (async () => {
        // Get the new years cake bags
        const cakeBags = Object.values(items)
            .filter(Array.isArray)
            .flat()
            .filter((item) => item?.tag?.ExtraAttributes?.new_year_cake_bag_data);

        // Decode the cakes from the new years cake bags data
        for (const item of cakeBags) {
            const cakeBagData = await decodeItem(Buffer.from(item.tag.ExtraAttributes.new_year_cake_bag_data, 'base64'));
            item.tag.ExtraAttributes.new_year_cake_bag_years = cakeBagData
                .filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake)
                .map((cake) => cake.tag.ExtraAttributes.new_years_cake);
        }
    })();

    // Add the sacks inventory
    const sacksData = profileData.sacks_counts || profileData.inventory?.sacks_counts;
    // Process the data
    if (sacksData) {
        items.sacks = Object.entries(sacksData)
            .filter(([_, amount]) => amount)
            .map(([id, amount]) => ({ id, amount }));
    } else {
        items.sacks = [];
    }

    // Add the essence inventory
    const essenceData = profileData.currencies?.essence;
    // Process the data
    if (essenceData) {
        items.essence = Object.entries(essenceData).map(([id, data]) => ({ id: `ESSENCE_${id.toUpperCase()}`, amount: data.current }));
    } else {
        items.essence = [];
    }

    // Add the pets inventory
    const petsData = profileData.pets_data?.pets;
    if (petsData) {
        items.pets = petsData.map((pet) => ({ ...pet }));
    } else {
        items.pets = [];
    }
};

module.exports = {
    parseItems,
    postParseItems,
};
