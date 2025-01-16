import {describe, expect, it} from 'vitest'
import Rotor from './Rotor';

describe("Rotor", ()=> {
    const testPairs = [1, 3, 1, 2, 2, 3];

    const rotations = [
        [ [ 1, 2 ], [ 2, 5 ], [ 3, 4 ], [ 4, 6 ], [ 5, 1 ], [ 6, 3 ] ],
        [ [ 1, 4 ], [ 2, 3 ], [ 3, 6 ], [ 4, 5 ], [ 5, 1 ], [ 6, 2 ] ],
        [ [ 1, 3 ], [ 2, 5 ], [ 3, 4 ], [ 4, 1 ], [ 5, 6 ], [ 6, 2 ] ],
        [ [ 1, 3 ], [ 2, 4 ], [ 3, 6 ], [ 4, 5 ], [ 5, 2 ], [ 6, 1 ] ],
        [ [ 1, 2 ], [ 2, 4 ], [ 3, 5 ], [ 4, 1 ], [ 5, 6 ], [ 6, 3 ] ],
        [ [ 1, 4 ], [ 2, 3 ], [ 3, 5 ], [ 4, 6 ], [ 5, 2 ], [ 6, 1 ] ]
    ];

    describe('Constructor validation', () => {
        it("creates instance", () => {
            const thresh = 2;
            const rotor = new Rotor(testPairs, thresh);

            // Check if instance is made
            expect(rotor).toBeInstanceOf(Rotor);

            // Check if default values are correct.
            expect(rotor.counter).toBe(0);
            expect(rotor.position).toBe(1);
            expect(rotor.thresh).toBe(thresh);
        });

        it('throws error for threshold < 1', () => {
            expect(() => new Rotor(testPairs, 0)).toThrow('Threshold cannot be smaller than 1');
        });
    
        it('throws error for missing mapping', () => {
            const operations = null as any
            expect(() => new Rotor(operations, 1)).toThrow(`"${JSON.stringify(operations)}" is not a valid rotor config.`);
        });
    
        it('uses default threshold of 1', () => {
            const rotor = new Rotor(testPairs);
            expect(rotor.thresh).toBe(1);
        });

        it('Creates list of operations', () => {
            const rotor = new Rotor(testPairs);
            // @ts-expect-error testing internal function
            expect(rotor.operations).toStrictEqual([1,3,1,2,2,3])
        });

    });

    describe('Rotate rotor', () => {
        /**Reference rotor rotations */
        


        it('rotates opertaions', ()=> {
            const rotor = new Rotor(testPairs);
            for(let cycle = 0; cycle <= 3; cycle++) {
                for(let pos = 1; pos <= testPairs.length; pos++) {
                    expect(rotor.position).toBe(pos);
                    // @ts-expect-error testing internal function
                    rotor.rotate();
                }
            }
        });

        it('generates correct mappings', () => {
            const rotor = new Rotor(testPairs);
            
            expect(rotor.mappings).toStrictEqual(rotations);
        });

        it('rotates every 6th cycle', ()=> {
            const cycles = [
                rotations[0],
                rotations[0],
                rotations[0],
                rotations[0],
                rotations[0],
                rotations[0],
                rotations[1],
                rotations[1],
                rotations[1],
                rotations[1],
                rotations[1],
                rotations[1],
                rotations[2],
                rotations[2],
                rotations[2],
                rotations[2],
                rotations[2],
                rotations[2],
                rotations[3],
            ]
            
            const rotor = new Rotor(testPairs, rotations.length);
            
            // for(let index = 0; index < rotations.length; index++) {
            //     expect(rotor.mapping).toStrictEqual(rotations[index]);
            //     for(let cycles = 0; cycles < rotations.length; cycles++) {
            //         rotor.update();
            //     }
            // }

            cycles.forEach((refMap) => {
                expect(rotor.mappings[rotor.position - 1]).toStrictEqual(refMap);
                rotor.update()
            })
        })
    });

    describe('Update rotor', () => {
        it('updates counter', () => {
            const rotor = new Rotor(testPairs, 100);
            for(let i = 0; i < 10; i++){
                expect(rotor.counter).toBe(i);
                rotor.update();
            };
        });
    });

    
    describe('Get value', () => {
        it('returns correct value (forwards, without rotation)', ()=> {
            const rotor = new Rotor(testPairs, 100);

            rotations[0].forEach((pair) => {
                const [input, output] = pair;
                const result = rotor.getValue(input, 'FORWARD');
                expect(result).toBe(output);
            });          
        });

        it('returns correct value (backwards, without rotation)', ()=> {
            const rotor = new Rotor(testPairs, 100);

            rotations[0].forEach(pair => {
                const [input, output] = pair;
                const result = rotor.getValue(output, 'REVERSE');
                expect(result).toBe(input)
            });
        });
    });
});