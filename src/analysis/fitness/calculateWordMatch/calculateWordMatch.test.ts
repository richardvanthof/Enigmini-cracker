import { describe, it, expect, vi } from 'vitest';
import matchWords, {generateWordList} from './calculateWordMatch';
import * as fs from 'fs';

vi.mock('fs');

describe('generate wordlist', () => {
    it('generates word list', async ()=>{
        const corpus = "Hallo wereld. De wereld is van mij."
        const list = await generateWordList(corpus);
        const target = new Set(['hallo', 'wereld', 'de', 'is', 'van', 'mij'] )
        expect(list).toStrictEqual(target);
    })

    it('scores strings', async () => {
        const text = "Hallo Werel. De wereld is van mij.";
        const words = new Set(['hallo', 'wereld', 'de', 'is', 'van', 'mij'] );
        expect(await matchWords(text, words)).toBe(-0.15415067982725836);
    })
});