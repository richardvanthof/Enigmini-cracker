import generateRotorVariations, {permuteConfigs} from "./generateRotors";
import {expect, it, describe} from 'vitest';

describe('checks input', () => {
    it('errors on asymmetrical input', async () => {
        await expect(generateRotorVariations([1,2,3], [1,2]))
        .rejects.toThrow('input and output array must be of same length.');
    });
});

describe('generates permutations', () => {
    it('permutes out-values', async () => {
        const target = [
            new Map([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]),
            new Map([ [ 1, 1 ], [ 2, 3 ], [ 3, 2 ] ]),
            new Map([ [ 1, 2 ], [ 2, 1 ], [ 3, 3 ] ]),
            new Map([ [ 1, 2 ], [ 2, 3 ], [ 3, 1 ] ]),
            new Map([ [ 1, 3 ], [ 2, 1 ], [ 3, 2 ] ]),
            new Map([ [ 1, 3 ], [ 2, 2 ], [ 3, 1 ] ])
          ]
        const permutations = await permuteConfigs([1,2,3], [1,2,3]);
        // console.log(permutations)
        expect(permutations).toHaveLength(6);
        expect(permutations).toStrictEqual(target);
    });

    it('generates the correct operations from rotor permutations.', async ()=> {
        const permutations = await generateRotorVariations([1,2,3]);
        const target = [
            [0, 0, 0],
            [0, 1, -1],
            [1, -1, 0],
            [1, 1, -2],
            [2, -1,-1],
            [2, 0, -2]
        ];

        expect(permutations).toStrictEqual(target);
    })
});