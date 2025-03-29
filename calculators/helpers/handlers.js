const PotatoBooksHandler = require('../handlers/PotatoBooks');
const RecombobulatorHandler = require('../handlers/Recombobulator');
const PickonimbusHandler = require('../handlers/Pickonimbus');
const PrestigeHandler = require('../handlers/Prestige');
const AttributeRollHandler = require('../handlers/AttributeRoll');
const ShensAuctionHandler = require('../handlers/ShensAuction');
const MidasWeaponsHandler = require('../handlers/MidasWeapon');
const EnchantedBookHandler = require('../handlers/EnchantedBook');
const ItemEnchantmentsHandler = require('../handlers/ItemEnchantments');
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
const PolarvoidBookHandler = require('../handlers/PolarvoidBook');
const DivanPowderCoatingHandler = require('../handlers/DivanPowderCoating');
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
const SoulboundSkinHandler = require('../handlers/SoulboundSkin');
const RodPartsHandler = require('../handlers/RodParts');

// For each handler, check if it applies and add the calculation to the total price
const handlers = [
    PickonimbusHandler,
    AttributeRollHandler,
    PrestigeHandler,
    ShensAuctionHandler,
    MidasWeaponsHandler,
    EnchantedBookHandler,
    ItemEnchantmentsHandler,
    AttributesHandler,
    PocketSackInASackHandler,
    WoodSingularityHandler,
    JalapenoBookHandler,
    TransmissionTunerHandler,
    ManaDisintegratorHandler,
    PulseRingThunderHandler,
    RuneHandler,
    PotatoBooksHandler,
    DyeHandler,
    ArtOfWarHandler,
    ArtOfPeaceHandler,
    FarmingForDummiesHandler,
    PolarvoidBookHandler,
    DivanPowderCoatingHandler,
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
    SoulboundSkinHandler,
    RodPartsHandler,
];

module.exports = handlers;
