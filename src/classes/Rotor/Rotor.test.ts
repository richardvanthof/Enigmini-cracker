import {describe, expect, it, test} from 'vitest'
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

    describe(('apply offset to index'), () => {
        it('shift index every cycle', () => {
            const thresh = 1; // Per how many cycles should we rotate?
            const index = 3; // Get 4th item in testlist
            const rotor = new Rotor(testPairs, thresh);
            rotor.update(); // increment offset to 1
            const adjustedIndex = rotor.applyOffsetTo(index);
            expect(adjustedIndex).toBe(2); // 3 - 1 = 2
        })

        it('shift index on the 6th cycle', () => {
            const thresh = 6; // Per how many cycles should we rotate?
            const index = 3; // Get 4th item in testlist
            const rotor = new Rotor(testPairs, thresh);
            
            let adjustedIndex;
            
            for(let cycle = 0; cycle < 6; cycle++) {
                // for the first 5 cycles the offset should be 0
                // aka the index should be the same (aka. 3)
                
                // Apply offset to index
                adjustedIndex = rotor.applyOffsetTo(index);
                //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
                expect(adjustedIndex).toBe(index); // 3 - 0 = 3
                
                // Increase counter
                rotor.update(); // increment counter by one
            }
            
            // on the 6th cycle the offset should be 1.
            // aka the index should be the input - 1 (aka. 2)
            adjustedIndex = rotor.applyOffsetTo(index);
            //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
            expect(adjustedIndex).toBe(index - 1); // 3 - 0 = 3
        });

        it('handles offset greater than list remainder', () => {
            // If a rotor has an offset greater than the list length remainder,
            // the rotor should wrap the offset around the list.

            const rotor = new Rotor(testPairs, 1);
            const index = 0; // get 1st item in testlist.
            rotor.setOffset(1); // offset is now 1 step greater than the list length
            const adjustedIndex = rotor.applyOffsetTo(index);
            console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
            expect(adjustedIndex).toBe(5);
        });

        it('handles offsets greater than list length', () => {
            // If a rotor has an offset greater than the list length,
            // the rotor should entirely wrap the offset around the list a couple of times.

            const rotor = new Rotor(testPairs, 1);
            const index = 0; // get 1st item in testlist.
            rotor.setOffset(50); //wraps around 9 times; remainder of 2.
            const adjustedIndex = rotor.applyOffsetTo(index);
            console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
            expect(adjustedIndex).toBe(4); //new index: 6 - 2 = 4
        });
    });

    // describe('updates offset', () => {
    //     it('per cycle', () => {
    //         const thresh = 1;
    //         const rotor = new Rotor(testPairs, thresh);
    //         for(let target = 0; target > testPairs.length; target++) {
    //             expect(rotor.counter).toBe(target) // counter should equal target
    //             expect(rotor.offset).toBe(target) // Offset is always a negative number
    //             rotor.update();
    //         }
    //     });
        
    //     it('per 6 cycles', () => {
    //         const thresh = 6; //Per how many cycles should we rotate?
    //         const rotor = new Rotor(testPairs, thresh);
    //         let cyclesCounter = 0;
            
    //         for(let target = 0; target <= 20; target++) {
    //             expect(rotor.offset).toBe(target);
                
    //             for(let cycles = 0; cycles < thresh; cycles++){
    //                 expect(rotor.counter).toBe(cyclesCounter)
    //                 rotor.update();
    //                 cyclesCounter++
    //             };
    //         }
    //     });
    // })

    // describe('getValue with rotation', () => {
    //     it('returns correct value after single rotation', () => {
    //         const rotor = new Rotor(testPairs, 1);
    //         rotor.update(); // offset becomes 1
    //         expect(rotor.getValue(3)).toBe(testPairs[1][1]); // should get next mapping
    //     });
    
    //     it('returns correct value after multiple rotations', () => {
    //         const rotor = new Rotor(testPairs, 1);
    //         // Rotate 3 times
    //         for (let i = 0; i < 3; i++) {
    //             rotor.update();
    //         }
    //         expect(rotor.getValue(1)).toBe(testPairs[3][1]);
    //     });
    
    //     it('handles rotation wrap-around', () => {
    //         const rotor = new Rotor(testPairs, 1);
    //         // Rotate length + 1 times
    //         for (let i = 0; i < 2; i++) {
    //             rotor.update();
    //         }
    //         expect(rotor.getValue(1)).toBe(testPairs[5][1]);
    //     });
    
    //     it('throws error for invalid input', () => {
    //         const rotor = new Rotor(testPairs, 1);
    //         expect(() => rotor.getValue(999)).toThrow();
    //     });
    // });
})