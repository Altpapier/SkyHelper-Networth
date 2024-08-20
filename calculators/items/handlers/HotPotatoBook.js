const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const ItemCalculationHandler = require('../ItemCalculationHandler');

class HotPotatoBookHandler extends ItemCalculationHandler {
    constructor(data) {
        super(data);
    }

    applies() {
        return !!this.itemData.tag.ExtraAttributes.hot_potato_count;
    }

    calculate() {
        const hotPotatoCount = Number(this.itemData.tag.ExtraAttributes.hot_potato_count);
        if (hotPotatoCount > 10) {
            const fumingPotatoBookCount = hotPotatoCount - 10;

            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'fuming_potato_book',
                price: (this.prices['fuming_potato_book'] || 0) * fumingPotatoBookCount * APPLICATION_WORTH.fumingPotatoBook,
                count: fumingPotatoBookCount,
            };

            this.price += calculationData.price;
            this.calculation.push(calculationData);
        }

        const hotPotatoBookCount = Math.min(hotPotatoCount, 10);
        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'hot_potato_book',
            price: (this.prices['hot_potato_book'] || 0) * hotPotatoBookCount * APPLICATION_WORTH.hotPotatoBook,
            count: hotPotatoBookCount,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = HotPotatoBookHandler;
