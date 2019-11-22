const operations = require('./operation.js');
const assert = require('assert');

it('correctly calculates the sum of 1 and 3', () => {
    assert.equal(operations.add(1, 3), 4);
    // return false;
});

it('indicates failure when a string is used instead of a number', () => {
    assert.equal(operations.validateNumbers('sammy', 5), false)
})

it('indicates failure when two strings is used instead of numbers', () => {
    assert.equal(operations.validateNumbers('sammy', 'sammy'), false)
})

it('successfully runs when two numbers are used', () => {
    assert.equal(operations.validateNumbers(5, 5), true)
})