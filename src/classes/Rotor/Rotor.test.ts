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
        testPairs.forEach((value, index) => {
        const input = value[0];
        expect(rotor.getValue(input)).toBe(testPairs[index][1])
        });
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

    describe('get offset', () => {
        it('handles looparound', () => {
            const thresh = 1;
            const rotor = new Rotor(testPairs, thresh);
            rotor.offset = 47; // offset of 47 % testpair.length (6) = 5

            expect(rotor.getOffset([1, 0])).toBe(-2); 
            // corrected offset should be: (testpair.length - (5 - 1)) *-1 = -2
        })
    })
})