import {describe, it, expect} from 'vitest'
import generatePlugboardCombinations from './generatePlugboards'

describe('input validation', () => {
    it('options have to be an even length', () => {
        expect(() => generatePlugboardCombinations([1,2,3]))
        .toThrowError('Options have to be an even amount.')
    });
});

it('generates combinations', () => {
    const options = [1,2,3,4, 5, 6];
    // TODO: find out what the totol for all plugboard combinations should be.
    expect(generatePlugboardCombinations(options).length).toBe(76)
})