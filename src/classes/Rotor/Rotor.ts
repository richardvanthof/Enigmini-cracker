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

    /**Rotate the rotor one step */
    rotate():void {

        /**Update offset counter */
        this.thresh++;

        /**shift the operations list */
        let lastOperation = this.operations.pop();
        if (lastOperation !== undefined) {
            this.operations.unshift(lastOperation);
        }

    }

    /**Increments counter and checks if the offset should be increased. */
    update():void {
        // Update counter
        this.counter++;

        // Check if counter passes the rotate threshold
        if (this.counter % this.thresh === 0 || this.thresh === 1) {
            this.rotate();
        }
    }
    
    /**Apply substitution cypher to single digit (often character coordinate). */
    getValue(input:number, direction: 'FORWARD' | 'REVERSE' = 'FORWARD'):number {
        // Find the entry in the list of coupled numbers.
        // direction === forward: check against the input value.
        // direction === reverse: check against the output value 
        const index = this.mapping.findIndex(([source, target]) => {
            const currentVal = direction === 'FORWARD' ? source : target;
            return input === currentVal;
        });
        
        // Check if an index was found.
        if(index === -1) { throw new Error(`'${input}' results in an invalid index.`) }
        
        const mutation = this.operations[index];
        const max = this.mapping.length;
        const min = 1
        const range = max - min + 1;

        const value = (direction === 'FORWARD') ? input + mutation : input - mutation;
        return ((value - min) % range + range) % range + min; 
    }
}

export default Rotor;