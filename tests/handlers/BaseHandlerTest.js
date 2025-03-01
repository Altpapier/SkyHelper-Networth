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
                    if (expectedNewPrice !== undefined) {
                        assert.strictEqual(item.price, expectedNewPrice, `Expected price to be set to ${expectedNewPrice} but got ${item.price}`);
                    } else {
                        assert.strictEqual(
                            item.price - priceBefore,
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
