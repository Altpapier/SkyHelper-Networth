const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

class HotPotatoBookHandler {
    applies(item) {
        return !!item.itemData.tag.ExtraAttributes.hot_potato_count;
    }

    calculate(item) {
        const hotPotatoCount = Number(item.itemData.tag.ExtraAttributes.hot_potato_count);
        if (hotPotatoCount > 10) {
            const fumingPotatoBookCount = hotPotatoCount - 10;

            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'fuming_potato_book',
                price: (item.prices['fuming_potato_book'] || 0) * fumingPotatoBookCount * APPLICATION_WORTH.fumingPotatoBook,
                count: fumingPotatoBookCount,
            };

            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }

        const hotPotatoBookCount = Math.min(hotPotatoCount, 10);
        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'hot_potato_book',
            price: (item.prices['hot_potato_book'] || 0) * hotPotatoBookCount * APPLICATION_WORTH.hotPotatoBook,
            count: hotPotatoBookCount,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = HotPotatoBookHandler;
