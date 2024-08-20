const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');

class HotPotatoBookHandler {
    static applies({ itemData }) {
        return !!itemData.tag.ExtraAttributes.hot_potato_count;
    }

    static calculate({ itemData, price, calculation }, prices) {
        const hotPotatoCount = Number(itemData.tag.ExtraAttributes.hot_potato_count);
        if (hotPotatoCount > 10) {
            const fumingPotatoBookCount = hotPotatoCount - 10;

            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'fuming_potato_book',
                price: (prices['fuming_potato_book'] || 0) * fumingPotatoBookCount * APPLICATION_WORTH.fumingPotatoBook,
                count: fumingPotatoBookCount,
            };

            price += calculationData.price;
            calculation.push(calculationData);
        }

        const hotPotatoBookCount = Math.min(hotPotatoCount, 10);
        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'hot_potato_book',
            price: (prices['hot_potato_book'] || 0) * hotPotatoBookCount * APPLICATION_WORTH.hotPotatoBook,
            count: hotPotatoBookCount,
        };

        price += calculationData.price;
        calculation.push(calculationData);
    }
}

module.exports = HotPotatoBookHandler;
