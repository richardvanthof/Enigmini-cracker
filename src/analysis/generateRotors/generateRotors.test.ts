import generateRotorVariations, {permuteConfigs, calculateSteps, generateMutations} from "./generateRotors";
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
})

describe('generate mutation options', () => {
    it('calculates steps to next rotor position', () => {
        const input = new Map([
            [1,2], 
            [5,1],
            [3,4],
            [2,6], 
            [6,3],
            [5,1]
        ]);

        const output = new Map([
            [1, 5], 
            [-4, 2],
            [1, -5],
            [4, -2], 
            [-3, 3],
            [-4, 2],
        ]);

        expect(calculateSteps(input)).toStrictEqual(output);
    });
});

describe('generate all options of mutation combinations', () => {
    it('generate mutations', async () =>{
        const input = new Map([
            [1, 5], 
            [-4, 2]
        ]);

        const output = [
            new Map([
                [1, 1], 
                [2, -4]

            ]),
            new Map([
                [1, 1], 
                [2, -4]
            ]),
            new Map([
                [1, 1], 
                [2, -4]
               
            ]),
            new Map([
                [1, 1], 
                [2, 2]
             
            ])
        ];

        expect(await generateMutations([input], [1,2,3,4,5,6])).toStrictEqual(output);
    })
})