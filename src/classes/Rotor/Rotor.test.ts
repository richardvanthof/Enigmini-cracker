import {describe, expect, it} from 'vitest'
import Rotor from './Rotor';

describe("Rotor", ()=> {
    const testPairs = [
        [1, 3],
        [2, 1],
        [3, 5],
        [4, 6],
        [5, 2],
        [6, 4]
    ]

    it('returns correct value (without rotation)', ()=> {
        const rotor = new Rotor(testPairs, 100);
        const result = rotor.getValue(1);
        expect(result).toBe(3)
    });

    it('updates counter', () => {
        const rotor = new Rotor(testPairs, 100);
        for(let i = 0; i < 10; i++){
            expect(rotor.counter).toBe(i);
            rotor.update()
        }
    });

    describe('updates offset', () => {
        it('per cycle', () => {
            const thresh = 1;
            const rotor = new Rotor(testPairs, thresh);
            for(let target = 0; target > testPairs.length; target++) {
                expect(rotor.counter).toBe(target) // counter should equal target
                expect(rotor.offset).toBe(target) // Offset is always a negative number
                rotor.update();
            }
        });
        
        it('per 6 cycles', () => {
            const thresh = 6; //Per how many cycles should we rotate?
            const rotor = new Rotor(testPairs, thresh);
            let cyclesCounter = 0;
            
            for(let target = 0; target <= 20; target++) {
                expect(rotor.offset).toBe(target);
                
                for(let cycles = 0; cycles < thresh; cycles++){
                    expect(rotor.counter).toBe(cyclesCounter)
                    rotor.update();
                    cyclesCounter++
                };
            }
        });
    })

    // describe('get corrected index', () => {
    //     it('gives correct mutation', () => {
    //         const thresh = 1
    //         const rotor = new Rotor(testPairs, thresh);
    //         rotor.offset = 0; 
    //         const targets = [0,0,0,0,0,1];
    //         const normalizeZero = (value:number) => value === -0 || value === +0 ? 0 : value;
    //         testPairs.forEach((pair, index) => {
    //             // get offset
    //             const correctedIndex = rotor.getIndex(index);
    //             expect(correctedIndex).toBe(targets[index])
    //             rotor.update()
    //         });
    //     })

    //     it('handles looparound', () => {
    //         const thresh = 1;
    //         const rotor = new Rotor(testPairs, thresh);
    //         rotor.offset = 47; // corr.offset: 47 % testpair.length (6) = 5

    //         const correctedIndex = rotor.getIndex(0);
    //         // corrected index should be: 
    //         // (testpair.length - (corr.offset - index))
    //         // aka. 6 - (5 - 0) = 1
            
    //         expect(correctedIndex).toBe(1); 

    //     })
    // })

    describe('Constructor validation', () => {
        it('throws error for threshold < 1', () => {
            expect(() => new Rotor(testPairs, 0)).toThrow('Threshold cannot be smaller than 1');
        });
    
        it('throws error for missing mapping', () => {
            expect(() => new Rotor(null as any, 1)).toThrow('Mapping config not defined');
        });
    
        it('uses default threshold of 1', () => {
            const rotor = new Rotor(testPairs);
            expect(rotor.thresh).toBe(1);
        });
    });
    
    describe('getValue with rotation', () => {
        it('returns correct value after single rotation', () => {
            const rotor = new Rotor(testPairs, 1);
            rotor.update(); // offset becomes 1
            expect(rotor.getValue(1)).toBe(testPairs[1][1]); // should get next mapping
        });
    
        it('returns correct value after multiple rotations', () => {
            const rotor = new Rotor(testPairs, 1);
            // Rotate 3 times
            for (let i = 0; i < 3; i++) {
                rotor.update();
            }
            expect(rotor.getValue(1)).toBe(testPairs[3][1]);
        });
    
        it('handles rotation wrap-around', () => {
            const rotor = new Rotor(testPairs, 1);
            // Rotate length + 1 times
            for (let i = 0; i < testPairs.length + 1; i++) {
                rotor.update();
            }
            expect(rotor.getValue(1)).toBe(testPairs[1][1]);
        });
    
        it('throws error for invalid input', () => {
            const rotor = new Rotor(testPairs, 1);
            expect(() => rotor.getValue(999)).toThrow();
        });
    });
})