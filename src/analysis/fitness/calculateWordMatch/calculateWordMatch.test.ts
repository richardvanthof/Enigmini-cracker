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
});