const HotPotatoBookHandler = require('../handlers/HotPotatoBook');
const RecombobulatorHandler = require('../handlers/Recombobulator');
const PickonimbusHandler = require('../handlers/Pickonimbus');
const GodRollAttributesHandler = require('../handlers/GodRollAttributes');
const ShensAuctionHandler = require('../handlers/ShensAuction');
const MidasWeaponsHandler = require('../handlers/MidasWeapon');
const EnchantedBookHandler = require('../handlers/EnchantedBook');
const ItemEnchantmentHandler = require('../handlers/ItemEnchantments');
const AttributesHandler = require('../handlers/Attributes');
const PocketSackInASackHandler = require('../handlers/PocketSackInASack');
const WoodSingularityHandler = require('../handlers/WoodSingularity');
const JalapenoBookHandler = require('../handlers/JalapenoBook');
const TransmissionTunerHandler = require('../handlers/TransmissionTuner');
const ManaDisintegratorHandler = require('../handlers/ManaDisintegrator');
const PulseRingThunderHandler = require('../handlers/PulseRingThunder');
const RuneHandler = require('../handlers/Rune');
const DyeHandler = require('../handlers/Dye');
const ArtOfWarHandler = require('../handlers/ArtOfWar');
const ArtOfPeaceHandler = require('../handlers/ArtOfPeace');
const FarmingForDummiesHandler = require('../handlers/FarmingForDummies');
const EnrichmentHandler = require('../handlers/Enrichment');
const GemstonesHandler = require('../handlers/Gemstones');
const GemstonePowerScrollHandler = require('../handlers/GemstonePowerScroll');
const ReforgeHandler = require('../handlers/Reforge');
const MasterStarsHandler = require('../handlers/MasterStars');
const EssenceStarsHandler = require('../handlers/EssenceStars');
const NecronBladeScrollsHandler = require('../handlers/NecronBladeScrolls');
const DrillPartsHandler = require('../handlers/DrillParts');
const EtherwarpConduitHandler = require('../handlers/EtherwarpConduit');
const NewYearCakeBagHandler = require('../handlers/NewYearCakeBag');

// For each handler, check if it applies and add the calculation to the total price
const handlers = [
    PickonimbusHandler,
    GodRollAttributesHandler,
    ShensAuctionHandler,
    MidasWeaponsHandler,
    EnchantedBookHandler,
    ItemEnchantmentHandler,
    AttributesHandler,
    PocketSackInASackHandler,
    WoodSingularityHandler,
    JalapenoBookHandler,
    TransmissionTunerHandler,
    ManaDisintegratorHandler,
    PulseRingThunderHandler,
    RuneHandler,
    HotPotatoBookHandler,
    DyeHandler,
    ArtOfWarHandler,
    ArtOfPeaceHandler,
    FarmingForDummiesHandler,
    EnrichmentHandler,
    RecombobulatorHandler,
    GemstonesHandler,
    GemstonePowerScrollHandler,
    ReforgeHandler,
    MasterStarsHandler,
    EssenceStarsHandler,
    NecronBladeScrollsHandler,
    DrillPartsHandler,
    EtherwarpConduitHandler,
    NewYearCakeBagHandler,
];

module.exports = handlers;
