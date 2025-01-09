import { describe, it, expect, vi } from 'vitest';
import matchWords from './calculateWordMatch';
import * as fs from 'fs';

vi.mock('fs');

describe('matchWords', () => {
    const wordListContent = `5144	scheiding	3
5145	daar	3
5146	scherpe	3`;
    it('should return correct match score when words match', async () => {
        const text = 'scherpe scheiding';
        const listPath = 'wordlist.txt';
        

        vi.spyOn(fs, 'readFileSync').mockReturnValue(wordListContent);

        const result = await matchWords(text, listPath);
        expect(result).toBe(1);
    });

    it('should return correct match score when words partially match', async () => {
        const text = 'hello daar';
        const listPath = 'wordlist.txt';

        vi.spyOn(fs, 'readFileSync').mockReturnValue(wordListContent);

        const result = await matchWords(text, listPath);
        expect(result).toBe(0.5);
    });

    it('should return 0 when no words match', async () => {
        const text = 'goodbye friend';
        const listPath = 'wordlist.txt';

        vi.spyOn(fs, 'readFileSync').mockReturnValue(wordListContent);

        const result = await matchWords(text, listPath);
        expect(result).toBe(0);
    });

    it('should handle non-alphabetic characters correctly', async () => {
        const text = 'Scherpe, scheiding!';
        const listPath = 'wordlist.txt';

        vi.spyOn(fs, 'readFileSync').mockReturnValue(wordListContent);

        const result = await matchWords(text, listPath);
        expect(result).toBe(1);
    });
});