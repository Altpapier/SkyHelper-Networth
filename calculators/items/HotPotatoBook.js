const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

class HotPotatoBookCalculation {
    constructor({ calculation, itemData, prices, price }) {
        this.calculation = calculation;
        this.itemData = itemData;
        this.prices = prices;
        this.price = price;
        // this.calculate();
    }

    isValid() {
        return !!this.itemData.ExtraAttributes.hot_potato_count;
    }

    calculate() {
        if (this.isValid === false) {
            return null;
        }

        const hotPotatoCount = Number(this.itemData.ExtraAttributes.hot_potato_count);
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
            price: (prices['hot_potato_book'] || 0) * hotPotatoBookCount * APPLICATION_WORTH.hotPotatoBook,
            count: hotPotatoBookCount,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = { HotPotatoBookCalculation };
