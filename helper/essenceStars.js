const { APPLICATION_WORTH } = require('../constants/applicationWorth');

function starCost(prices, upgrade, star) {
    const upgradePrice = upgrade.essence_type ? prices[`ESSENCE_${upgrade.essence_type}`] : prices[upgrade.item_id];
    if (!upgradePrice) return;

    const calculationData = {
        id: upgrade.essence_type ? `${upgrade.essence_type}_ESSENCE` : upgrade.item_id,
        type: star ? 'STAR' : 'PRESTIGE',
        price: (upgrade.amount ?? 0) * (upgradePrice ?? 0) * (upgrade.essence_type ? APPLICATION_WORTH.essence : 1),
        count: upgrade.amount ?? 0,
    };
    if (star) calculationData.star = star;
    return calculationData;
}

function starCosts(prices, calculation, upgrades, prestigeItem) {
    let price = 0;
    let star = 0;
    const datas = [];
    for (const upgrade of upgrades) {
        star++;
        let data;
        if (upgrade instanceof Array) {
            for (const cost of upgrade) {
                data = starCost(prices, cost, star);
                datas.push(data);
                if (!prestigeItem && data) {
                    price += data.price;
                    calculation.push(data);
                }
            }
        } else {
            data = starCost(prices, upgrade);
            datas.push(data);
            if (!prestigeItem && data) {
                price += data.price;
                calculation.push(data);
            }
        }
    }

    if (prestigeItem && datas.length && datas?.[0]) {
        const prestige = datas[0].type === 'PRESTIGE';
        const calculationData = datas.reduce(
            (acc, val) => {
                acc.price += val?.price ?? 0;
                return acc;
            },
            { id: prestigeItem, type: prestige ? 'PRESTIGE' : 'STARS', price: 0, count: prestige ? 1 : star }
        );

        if (prestige && prices[prestigeItem.toUpperCase()]) calculationData.price += prices[prestigeItem.toUpperCase()];
        price += calculationData.price;
        calculation.push(calculationData);
    }
    return price;
}

module.exports = { starCosts, starCost };
