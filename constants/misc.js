const blockedEnchants = {
    BONE_BOOMERANG: ['OVERLOAD', 'POWER', 'ULTIMATE_SOAL_EATER'],
    DEATH_BOW: ['OVERLOAD', 'POWER', 'ULTIMATE_SOAL_EATER'],
    GARDENING_AXE: ['REPLENISH'],
    GARDENING_HOE: ['REPLENISH'],
    ADVANCED_GARDENING_AXE: ['REPLENISH'],
    ADVANCED_GARDENING_HOE: ['REPLENISH'],
};

const ignoredEnchants = {
    SCAVENGER: 5,
};

const stackingEnchants = ['EXPERTISE', 'COMPACT', 'CULTIVATING', 'CHAMPION', 'HECATOMB', 'TOXOPHILITE'];

const ignoreSilex = ['PROMISING_SPADE'];

const masterStars = ['FIRST_MASTER_STAR', 'SECOND_MASTER_STAR', 'THIRD_MASTER_STAR', 'FOURTH_MASTER_STAR', 'FIFTH_MASTER_STAR'];

const validRunes = [
    'MUSIC_1',
    'MUSIC_2',
    'MUSIC_3',
    'MEOW_MUSIC_3',
    'ENCHANT_1',
    'ENCHANT_2',
    'ENCHANT_3',
    'GRAND_SEARING_3',
    'SPELLBOUND_3',
    'GRAND_FREEZING_3',
    'PRIMAL_FEAR_3',
    'GOLDEN_CARPET_3',
    'ICE_SKATES_3',
    'BARK_TUNES_3',
    'SMITTEN_3',
    'RAINY_DAY_3',
];

const ALLOWED_RECOMBOBULATED_CATEGORIES = ['ACCESSORY', 'NECKLACE', 'GLOVES', 'BRACELET', 'BELT', 'CLOAK'];
const ALLOWED_RECOMBOBULATED_IDS = [
    'divan_helmet',
    'divan_chestplate',
    'divan_leggings',
    'divan_boots',
    'fermento_helmet',
    'fermento_chestplate',
    'fermento_leggings',
    'fermento_boots',
    'shadow_assassin_cloak',
    'starred_shadow_assassin_cloak',
];

const ATTRIBUTE_BASE_COSTS = {
    GLOWSTONE_GAUNTLET: 'GLOWSTONE_GAUNTLET',
    VANQUISHED_GLOWSTONE_GAUNTLET: 'GLOWSTONE_GAUNTLET',
    BLAZE_BELT: 'BLAZE_BELT',
    VANQUISHED_BLAZE_BELT: 'BLAZE_BELT',
    MAGMA_NECKLACE: 'MAGMA_NECKLACE',
    VANQUISHED_MAGMA_NECKLACE: 'MAGMA_NECKLACE',
    MAGMA_ROD: 'MAGMA_ROD',
    INFERNO_ROD: 'MAGMA_ROD',
    HELLFIRE_ROD: 'MAGMA_ROD',
};

const enrichments = [
    'TALISMAN_ENRICHMENT_CRITICAL_CHANCE',
    'TALISMAN_ENRICHMENT_CRITICAL_DAMAGE',
    'TALISMAN_ENRICHMENT_DEFENSE',
    'TALISMAN_ENRICHMENT_HEALTH',
    'TALISMAN_ENRICHMENT_INTELLIGENCE',
    'TALISMAN_ENRICHMENT_MAGIC_FIND',
    'TALISMAN_ENRICHMENT_WALK_SPEED',
    'TALISMAN_ENRICHMENT_STRENGTH',
    'TALISMAN_ENRICHMENT_ATTACK_SPEED',
    'TALISMAN_ENRICHMENT_FEROCITY',
    'TALISMAN_ENRICHMENT_SEA_CREATURE_CHANCE',
];

const PICKONIMBUS_DURABILITY = 5000;

const specialEnchantmentMatches = {
    aiming: 'Dragon Tracer',
    counter_strike: 'Counter-Strike',
    turbo_cacti: 'Turbo-Cacti',
    turbo_cane: 'Turbo-Cane',
    turbo_carrot: 'Turbo-Carrot',
    turbo_cocoa: 'Turbo-Cocoa',
    turbo_melon: 'Turbo-Melon',
    turbo_mushrooms: 'Turbo-Mushrooms',
    turbo_potato: 'Turbo-Potato',
    turbo_pumpkin: 'Turbo-Pumpkin',
    turbo_warts: 'Turbo-Warts',
    turbo_wheat: 'Turbo-Wheat',
    ultimate_reiterate: 'Ultimate Duplex',
    ultimate_bobbin_time: "Ultimate Bobbin' Time",
};

const GEMSTONE_SLOTS = ['COMBAT', 'OFFENSIVE', 'DEFENSIVE', 'MINING', 'UNIVERSAL', 'CHISEL'];

module.exports = {
    blockedEnchants,
    ignoredEnchants,
    stackingEnchants,
    ignoreSilex,
    masterStars,
    validRunes,
    ALLOWED_RECOMBOBULATED_CATEGORIES,
    ALLOWED_RECOMBOBULATED_IDS,
    ATTRIBUTE_BASE_COSTS,
    enrichments,
    PICKONIMBUS_DURABILITY,
    specialEnchantmentMatches,
    GEMSTONE_SLOTS,
};
