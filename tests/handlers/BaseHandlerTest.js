const assert = require('assert');

class BaseHandlerTest {
    constructor(HandlerClass, testCases) {
        this.HandlerClass = HandlerClass;
        this.testCases = testCases;
    }

    runTests() {
        describe(`${this.HandlerClass.name} Tests`, () => {
            this.testCases.forEach(({ description, item, prices, shouldApply, expectedNewPrice = undefined, expectedPriceChange = 0, expectedCalculation = [] }) => {
                it(description, () => {
                    const handler = new this.HandlerClass();

                    // Check if handler applies
                    const applies = handler.applies(item);
                    assert.strictEqual(applies, shouldApply, `Expected applies() to return ${shouldApply}`);

                    // Validate calculation
                    const priceBefore = item.price;
                    if (shouldApply) {
                        handler.calculate(item, prices);
                    }
                    assert.deepStrictEqual(item.calculation, expectedCalculation, 'Calculation does not match expected');

                    const newPrice = item.price + item.calculation.filter((c) => !c.ignore).reduce((acc, c) => acc + c.price, 0);
                    if (expectedNewPrice !== undefined) {
                        assert.strictEqual(newPrice, expectedNewPrice, `Expected price to be set to ${expectedNewPrice} but got ${item.price}`);
                    } else {
                        assert.strictEqual(
                            newPrice - priceBefore,
                            expectedPriceChange,
                            `Expected price to increase by ${expectedPriceChange} but got ${item.price - priceBefore}`,
                        );
                    }
                });
            });
        });
    }
}

module.exports = BaseHandlerTest;
