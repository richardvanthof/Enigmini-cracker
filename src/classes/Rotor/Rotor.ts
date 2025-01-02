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
* - Add an number pairs to `mappings` as an array of arrays with the .
* - `Threshold` enables you to specify per how many encryption clycles the rotor must shift.
* @public
*/
class Rotor {
    // Types
    counter: number;
    offset: number;
    readonly thresh: number;
    mapping: number[][];
    operations: number[];

    constructor(
        mapping:number[][], 
        threshold:number=1
    ) {
        if(threshold < 1) {throw new Error('Threshold cannot be smaller than 1.')}
        if(!mapping) {throw new Error('Mapping config not defined.')}

        this.counter = 0;
        this.offset = 1;
        this.thresh = Math.floor(threshold);
        this.mapping = mapping;
        this.operations = this.mapping.map(val => {
            const [input, output, mutation] = val;
            if(mutation) {return mutation}
            else { return output - input}
        });
    }
    
    /**Normalize mutated value to 1-6 range and wrap around if needed.*/
    normalize(value: number):number {
        const min = 1;
        const max = this.mapping.length;
        const range = max - min + 1;

        return ((value - min) % range + range) % range + min;
    };

    /**Rotate the rotor one step */
    rotate():void {

        /**Update offset counter */
        this.offset++;

        /**shift the operations list */
        let lastOperation = this.operations.pop();
        if (lastOperation !== undefined) {
            this.operations.unshift(lastOperation);
        };
        
        /**Generate new output values and mapping based on new operations list. */
        this.mapping = this.mapping.map((value, index) => {
            const [input] = value;
           
            /**Input adjusted by currect mutation */
            const mutation = this.operations[index];
            let output = this.normalize(input + mutation);
            
            return [input, output, mutation];
        });
    };

    /**Increments counter and checks if the offset should be increased. */
    update():void {
        // Update counter
        this.counter++;
        
        // Check if counter passes the rotate threshold.
        if ( this.counter % this.thresh == 0 || this.thresh === 1) {
            // console.log('rotate triggered at count', this.counter)
            this.rotate();
        }
    }

   
    /**Apply substitution cypher to single digit (often character coordinate). */
    getValue(_input:number, direction: 'FORWARD' | 'REVERSE' = 'FORWARD'):number {
        
        const selected = this.mapping.find(([inputValue, outputValue]) => {
            const selector = direction === 'FORWARD' ? inputValue : outputValue
            return  _input === selector
        });
        
        // Check if an index was found.
        if(!selected) { throw new Error(`'${_input}' results in an invalid index.`) }

        const [input, output] = selected;
        return direction === 'FORWARD' ? output : input;
        
    }
}

export default Rotor;