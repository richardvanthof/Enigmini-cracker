import {describe, it, expect} from 'vitest'
import generatePlugboardCombinations from './generatePlugboards'

describe('input validation', () => {
    it('options have to be an even length', async () => {
        await expect(generatePlugboardCombinations([1, 2, 3])).rejects.toThrow('Options have to be an even amount.');
    });
});

describe('combination generation', () => {
    it('generates combinations', async () => {
        const options = [1, 2, 3, 4, 5, 6];
        const result = await generatePlugboardCombinations(options);
        // TODO: find out what the total for all plugboard combinations should be.
        expect(result).toHaveLength(76);
    });
});