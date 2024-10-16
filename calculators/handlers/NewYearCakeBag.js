/**
 * A handler for New Year Cake Bags.
 */
class NewYearCakeBagHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.new_year_cake_bag_years;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        let cakesPrice = 0;
        for (const year of item.extraAttributes.new_year_cake_bag_years) cakesPrice += prices[`NEW_YEAR_CAKE_${year}`] || 0;

        const calculationData = {
            id: 'NEW_YEAR_CAKES',
            type: 'NEW_YEAR_CAKES',
            price: cakesPrice,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = NewYearCakeBagHandler;
