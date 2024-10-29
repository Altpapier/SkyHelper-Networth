const blockedEnchants = {
  bone_boomerang: ['overload', 'power', 'ultimate_soul_eater'],
  death_bow: ['overload', 'power', 'ultimate_soul_eater'],
  gardening_axe: ['replenish'],
  gardening_hoe: ['replenish'],
  advanced_gardening_axe: ['replenish'],
  advanced_gardening_hoe: ['replenish'],
};

const ignoredEnchants = {
  scavenger: 5,
};

const stackingEnchants = ['expertise', 'compact', 'cultivating', 'champion', 'hecatomb', 'toxophilite'];

const ignoreSilex = ['promising_spade'];

const masterStars = ['first_master_star', 'second_master_star', 'third_master_star', 'fourth_master_star', 'fifth_master_star'];

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
  'SUPER_PUMPKIN_3',
];

const allowedRecombTypes = ['ACCESSORY', 'NECKLACE', 'GLOVES', 'BRACELET', 'BELT', 'CLOAK'];
const allowedRecombIds = [
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

const attributesBaseCosts = {
  glowstone_gauntlet: 'glowstone_gauntlet',
  vanquished_glowstone_gauntlet: 'glowstone_gauntlet',
  blaze_belt: 'blaze_belt',
  vanquished_blaze_belt: 'blaze_belt',
  magma_necklace: 'magma_necklace',
  vanquished_magma_necklace: 'magma_necklace',
  magma_rod: 'magma_rod',
  inferno_rod: 'magma_rod',
  hellfire_rod: 'magma_rod',
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

const pickonimbusDurability = 5000;

const specialEnchantmentMatches = {
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

module.exports = {
  blockedEnchants,
  ignoredEnchants,
  stackingEnchants,
  ignoreSilex,
  masterStars,
  validRunes,
  allowedRecombTypes,
  allowedRecombIds,
  attributesBaseCosts,
  enrichments,
  pickonimbusDurability,
  specialEnchantmentMatches,
};
