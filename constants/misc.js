const BLOCKED_ENCHANTMENTS = {
    BONE_BOOMERANG: ['OVERLOAD', 'POWER', 'ULTIMATE_SOUL_EATER'],
    DEATH_BOW: ['OVERLOAD', 'POWER', 'ULTIMATE_SOUL_EATER'],
    GARDENING_AXE: ['REPLENISH'],
    GARDENING_HOE: ['REPLENISH'],
    ADVANCED_GARDENING_AXE: ['REPLENISH'],
    ADVANCED_GARDENING_HOE: ['REPLENISH'],
};

const IGNORED_ENCHANTMENTS = {
    SCAVENGER: 5,
};

const STACKING_ENCHANTMENTS = ['EXPERTISE', 'COMPACT', 'CULTIVATING', 'CHAMPION', 'HECATOMB', 'TOXOPHILITE'];

const IGNORE_SILEX = ['PROMISING_SPADE', 'PROMISING_AXE'];

const MASTER_STARS = ['FIRST_MASTER_STAR', 'SECOND_MASTER_STAR', 'THIRD_MASTER_STAR', 'FOURTH_MASTER_STAR', 'FIFTH_MASTER_STAR'];

const ALLOWED_RECOMBOBULATED_CATEGORIES = ['ACCESSORY', 'NECKLACE', 'GLOVES', 'BRACELET', 'BELT', 'CLOAK', 'VACUUM'];
const ALLOWED_RECOMBOBULATED_IDS = [
    'DIVAN_HELMET',
    'DIVAN_CHESTPLATE',
    'DIVAN_LEGGINGS',
    'DIVAN_BOOTS',
    'FERMENTO_HELMET',
    'FERMENTO_CHESTPLATE',
    'FERMENTO_LEGGINGS',
    'FERMENTO_BOOTS',
    'SHADOW_ASSASSIN_CLOAK',
    'STARRED_SHADOW_ASSASSIN_CLOAK',
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

const ENRICHMENTS = [
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

const SPECIAL_ENCHANTMENT_NAMES = {
    aiming: 'Dragon Tracer',
    counter_strike: 'Counter-Strike',
    pristine: 'Prismatic',
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

const NON_COSMETIC_ITEMS = new Set([
    'ANCIENT_ELEVATOR',
    'BEDROCK',
    'CREATIVE_MIND',
    'CREATIVE_MIND_UNEDITIONED',
    'DCTR_SPACE_HELM',
    'DCTR_SPACE_HELM_EDITIONED',
    'DEAD_BUSH_OF_LOVE',
    'DUECES_BUILDER_CLAY',
    'GAME_BREAKER',
    'POTATO_BASKET',
]);

module.exports = {
    BLOCKED_ENCHANTMENTS,
    IGNORED_ENCHANTMENTS,
    STACKING_ENCHANTMENTS,
    IGNORE_SILEX,
    MASTER_STARS,
    ALLOWED_RECOMBOBULATED_CATEGORIES,
    ALLOWED_RECOMBOBULATED_IDS,
    ATTRIBUTE_BASE_COSTS,
    ENRICHMENTS,
    PICKONIMBUS_DURABILITY,
    SPECIAL_ENCHANTMENT_NAMES,
    GEMSTONE_SLOTS,
    NON_COSMETIC_ITEMS,
};
