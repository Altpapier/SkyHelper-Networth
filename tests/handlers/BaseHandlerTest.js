const assert = require('assert');

class BaseHandlerTest {
    constructor(HandlerClass, testCases) {
        this.HandlerClass = HandlerClass;
        this.testCases = testCases;
    }

    runTests() {
        describe(`${this.HandlerClass.name} Tests`, () => {
            this.testCases.forEach(({ description, item, prices, shouldApply, expectedPriceChange = 0, expectedCalculation = [] }) => {
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
                    assert.strictEqual(item.price - priceBefore, expectedPriceChange, `Expected price ${expectedPriceChange} but got ${item.price}`);
                    assert.deepStrictEqual(item.calculation, expectedCalculation, 'Calculation does not match expected');
                });
            });
        });
    }
}

module.exports = BaseHandlerTest;
