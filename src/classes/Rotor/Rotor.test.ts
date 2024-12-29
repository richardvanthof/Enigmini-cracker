import {describe, expect, it} from 'vitest'
import Rotor from './Rotor';

describe("Rotor", ()=> {
    const testPairs = [
        [1, 2, 1],
        [2, 5, 3],
        [3, 4, 1],
        [4, 6, 2],
        [5, 1, 2],
        [6, 3, 3]
    ]

    describe('Constructor validation', () => {
        it("creates instance", () => {
            const thresh = 2;
            const rotor = new Rotor(testPairs, thresh);

            // Check if instance is made
            expect(rotor).toBeInstanceOf(Rotor);

            // Check if default values are correct.
            expect(rotor.counter).toBe(0);
            expect(rotor.offset).toBe(0);
            expect(rotor.thresh).toBe(thresh);
        });

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

        it('Creates list of operations', () => {
            const rotor = new Rotor(testPairs);
            expect(rotor.operations).toStrictEqual([1,3,1,2,2,3])
        });

        it('Guess operation if it is undefined.', () => {
            const noOperations = [
                [1, 2],
                [2, 5],
                [3, 4],
                [4, 6],
                [5, 1],
                [6, 3]
            ]
            const rotor = new Rotor(noOperations);
            expect(rotor.operations).toStrictEqual([1,3,1,2,-4,-3])
        });

    });

    describe('Rotate rotor', () => {
        it('moves rotor one step', ()=> {
            const rotor = new Rotor(testPairs);
            
            // Check initial state
            expect(rotor.operations).toStrictEqual([1,3,1,2,2,3])

            // Rotate operations one step
            // move last operation to start of list.
            rotor.rotate();
            expect(rotor.operations).toStrictEqual([3,1,3,1,2,2])
        })
    })

    describe('Update rotor', () => {
        it('updates counter', () => {
            const rotor = new Rotor(testPairs, 100);
            for(let i = 0; i < 10; i++){
                expect(rotor.counter).toBe(i);
                rotor.update()
            }
        });

    })

    
    describe('Get value', ()=>{
        it('returns correct value (forwards, without rotation)', ()=> {
            const rotor = new Rotor(testPairs, 100);
           
            let result = rotor.getValue(1);
            expect(result).toBe(2)
            
            result = rotor.getValue(2);
            expect(result).toBe(5)
            
            result = rotor.getValue(6);
            expect(result).toBe(3)
          
        });

        it('returns correct value (backwards, without rotation)', ()=> {
            const rotor = new Rotor(testPairs, 100);
            
            let result = rotor.getValue(1, 'REVERSE');
            expect(result).toBe(5)

            result = rotor.getValue(2, 'REVERSE');
            expect(result).toBe(1)

            result = rotor.getValue(6, 'REVERSE');
            expect(result).toBe(4)
        });
    })



    // describe(('apply offset to index'), () => {

    //     describe('shift index every cycle', () => {
    //         it('forward direction', () => {
    //             const thresh = 1; // Per how many cycles should we rotate?
    //             const index = 3; // Get 4th item in testlist
    //             const rotor = new Rotor(testPairs, thresh);
    //             rotor.update(); // increment offset to 1
    //             const adjustedIndex = rotor.applyOffsetTo(index);
    //             expect(adjustedIndex).toBe(2); // 3 - 1 = 2
    //         });
    //         it('reverse direction', () => {
    //             const thresh = 1; // Per how many cycles should we rotate?
    //             const index = 3; // Get 4th item in testlist
    //             const rotor = new Rotor(testPairs, thresh);
    //             rotor.update(); // increment offset to 1
    //             const adjustedIndex = rotor.applyOffsetTo(index,'REVERSE');
    //             expect(adjustedIndex).toBe(4); // 3 + 1 = 4
    //         })
    //     })

    //     describe('shift index on the 6th cycle', () => {
    //         it('forward direction', () => {
    //             const thresh = 6; // Per how many cycles should we rotate?
    //             const index = 3; // Get 4th item in testlist
    //             const rotor = new Rotor(testPairs, thresh);
                
    //             let adjustedIndex;
                
    //             for(let cycle = 0; cycle < 6; cycle++) {
    //                 // for the first 5 cycles the offset should be 0
    //                 // aka the index should be the same (aka. 3)
                    
    //                 // Apply offset to index
    //                 adjustedIndex = rotor.applyOffsetTo(index);
    //                 //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //                 expect(adjustedIndex).toBe(index); // 3 - 0 = 3
                    
    //                 // Increase counter
    //                 rotor.update(); // increment counter by one
    //             }
                
    //             // on the 6th cycle the offset should be 1.
    //             // aka the index should be the input - 1 (aka. 2)
    //             adjustedIndex = rotor.applyOffsetTo(index);
    //             //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(index - 1); // 3 - 0 = 3
    //         });

    //         it('reverse direction', () => {
    //             const thresh = 6; // Per how many cycles should we rotate?
    //             const index = 3; // Get 4th item in testlist
    //             const rotor = new Rotor(testPairs, thresh);
                
    //             let adjustedIndex;
                
    //             for(let cycle = 0; cycle < 6; cycle++) {
    //                 // for the first 5 cycles the offset should be 0
    //                 // aka the index should be the same (aka. 3)
                    
    //                 // Apply offset to index
    //                 adjustedIndex = rotor.applyOffsetTo(index);
    //                 //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //                 expect(adjustedIndex).toBe(index); // 3 + 0 = 3
                    
    //                 // Increase counter
    //                 rotor.update(); // increment counter by one
    //             }
                
    //             // on the 6th cycle the offset should be 1.
    //             // aka the index should be the input + 1 (aka. 3)
    //             adjustedIndex = rotor.applyOffsetTo(index, 'REVERSE');
    //             //console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(index + 1); // 3 - 0 = 3
    //         });
    //     })


        
    //     describe('handles offset greater than list remainder', () => {
    //     // If a rotor has an offset greater than the list length remainder,
    //     // the rotor should wrap the offset around the list.

    //         it('Wraps around to end of list (direction: forward)', () => {
    //             const rotor = new Rotor(testPairs, 1);
    //             const index = 0; // get 1st item in testlist.
    //             rotor.setOffset(1); // offset is now 1 step greater than the list remainder
    //             const adjustedIndex = rotor.applyOffsetTo(index);
    //             console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(5);
    //         });

    //         it('Wraps around to begin of list (direction: reverse)', () => {
    //             const rotor = new Rotor(testPairs, 1);
    //             const index = testPairs.length -1; // get last item in testlist.
    //             rotor.setOffset(1); // offset is now 1 step greater than the list remainder
    //             const adjustedIndex = rotor.applyOffsetTo(index, 'REVERSE');
    //             console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(0);
    //         });
    //     })

    //     describe('handles offsets greater than list length', () => {
    //         it('forward mode', () => {
    //             // If a rotor has an offset greater than the list length,
    //             // the rotor should entirely wrap the offset around the list a couple of times.
    
    //             const rotor = new Rotor(testPairs, 1);
    //             const index = 0; // get 1st item in testlist.
    //             rotor.setOffset(50); //wraps around 9 times; remainder of 2.
    //             const adjustedIndex = rotor.applyOffsetTo(index);
    //             console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(4); //new index: 6 - 2 = 4
    //         });
    //         it('reverse mode', () => {
    //             // If a rotor has an offset greater than the list length,
    //             // the rotor should entirely wrap the offset around the list a couple of times.
    
    //             const rotor = new Rotor(testPairs, 1);
    //             const index = 0; // get 1st item in testlist.
    //             rotor.setOffset(50); //wraps around 9 times; remainder of 2.
    //             const adjustedIndex = rotor.applyOffsetTo(index, 'REVERSE');
    //             console.log({counter: rotor.counter, offset: rotor.offset, adjustedIndex})
    //             expect(adjustedIndex).toBe(2); //new index: 2
    //         });
    //     })
    // });
})