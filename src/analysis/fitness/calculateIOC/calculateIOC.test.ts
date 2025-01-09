import {it, describe, expect} from 'vitest';
import calculateIOC, {countFrequencies} from './calculateIOC.js';


describe('countFrequencies', () => {
    it('returns empty map for empty string', () => {
        const result = countFrequencies('');
        expect(result.size).toBe(0);
    });

    it('counts single character correctly', () => {
        const result = countFrequencies('a');
        expect(result.get('a')).toBe(1);
    });

    it('counts multiple characters correctly', () => {
        const result = countFrequencies('aabbc');
        expect(result.get('a')).toBe(2);
        expect(result.get('b')).toBe(2);
        expect(result.get('c')).toBe(1);
    });
});

describe('calculateIOC', () => {
    it('throws error for empty string', () => {
        expect(() => calculateIOC('')).toThrow('Input string is empty.');
    });

    it('throws error for single character string', () => {
        expect(() => calculateIOC('a')).toThrow('Input string is empty.');
    });

    it('calculates IOC correctly for multiple characters', () => {
        const result = calculateIOC('aabbc');
        // Expected IOC: (2*1 + 2*1 + 1*0) / (5*4) = 4 / 20 = 0.2
        expect(result).toBeCloseTo(0.2, 5);
    });

    it('calculates IOC correctly for uniform characters', () => {
        const result = calculateIOC('aaaa');
        // Expected IOC: (4*3) / (4*3) = 12 / 12 = 1
        expect(result).toBe(1);
    });
});