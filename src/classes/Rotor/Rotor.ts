/**
* The Rotor class implements a rotating substitution cipher where 
* numbers are mapped to other numbers, with the mapping shifting 
* based on a counter and threshold system.
* 
* Multiple rotors can be added as a list to an Enigma instance
* to configure the encyrption settings.
* 
* @example
* ```typescript
* const map = [[1, 3], [2, 1], [3,2]]
* const rotors = [new Rotor(map, 3), new Rotor(map, 3)]
* const enigma = new Enigmini(keyMap, rotors, reflector, plugboard);
* ```
* @remarks
* - Add an number pairs to `mappings` as an array of arrays with the two coupled numbers.
* - `Threshold` enables you to specify per how many encryption clycles the rotor must shift.
* @public
*/
class Rotor {
    // Types
    counter: number;
    offset: number;
    thresh: number;
    mapping: number[][];
    operations: number[];

    constructor(
        mapping:number[][], 
        threshold:number=1
    ) {
        if(threshold < 1) {throw new Error('Threshold cannot be smaller than 1.')}
        if(!mapping) {throw new Error('Mapping config not defined.')}

        this.counter = 0;
        this.offset = 0;
        this.thresh = Math.floor(threshold);
        this.mapping = mapping;
        this.operations = this.mapping.map(val => {
            const [input, output, mutation] = val;
            if(mutation) {return mutation}
            else { return output - input}
        })
    }

    // /**Increments counter and checks if the offset should be increased. */
    // update():void {
    //     // Update counter
    //     this.counter++;

    //     // Check if counter passes the rotate threshold
    //     if (this.counter % this.thresh === 0 || this.thresh === 1) {
    //         this.offset++
    //         if(this.offset == +0 || this.offset == -0) {this.offset = 0}
    //     }
    // }

    // /**Shifts the target index according to the currect offset */
    // applyOffsetTo(index: number, direction: 'FORWARD' | 'REVERSE' = 'FORWARD'): number {

    //     const mapLength = this.mapping.length;
        
    //     // Loop around the list a couple of times if the offset is longer than the list length.
    //     const offset = ((this.offset % mapLength) + mapLength) % mapLength;;
    //     // - First %: Handle offsets larger than mapLength
    //     // - mapLength: Make negative numbers positive
    //     // - Second %: Ensure result is within [0, mapLength])
        
    //     let newIndex;
    //     if(direction === 'FORWARD') {
    //         // If direction is FORWARD: subtract offset from index
    //         newIndex = index - offset;
    //         if(newIndex < 0) {
    //             newIndex = mapLength + newIndex;
    //         }
    //     } else {
    //         // If direction is REVERSE: add offset to index
    //         // This is because when going in reverse, we need to compensate
    //         // for the counter-clockwise movement in the opposite direction
    //         newIndex = index + offset;
    //         if(newIndex >= mapLength - 1) {
    //             newIndex = mapLength - newIndex;
    //         }
    //     }
    //     return newIndex;
    // }

    // /*Manualy set the current offset*/
    // setOffset(offset: number): void {
    //     this.offset = offset;
    // }
    
    // /**Apply substitution cypher to single digit (often character coordinate). */
    // getValue(input:number, direction: 'FORWARD' | 'REVERSE' = 'FORWARD'):number {
    //     // Find the entry in the list of coupled numbers.
    //     // direction === forward: check against the input value.
    //     // direction === reverse: check against the output value 
    //     const index = this.mapping.findIndex(([source, target]) => {
    //         const currentVal = direction === 'FORWARD' ? source : target;
    //         return input === currentVal;
    //     });
        
    //     // Check if an index was found.
    //     if(index === -1) { throw new Error('Invalid input') }
        
    //     // Get rotated position
    //     const adjustedIndex = this.applyOffsetTo(index);
        
    //     // Get mapped value at rotated position
    //     const newVal = this.mapping[adjustedIndex][direction === 'REVERSE' ? 0 : 1];
    //     return newVal;
    // }
}

export default Rotor;