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
    position: number;
    readonly thresh: number;
    mappings: number[][][];
    private operations: number[];

    constructor(
        _operations:number[], 
        _threshold:number=1
    ) {
        if(_threshold < 1) {throw new Error('Threshold cannot be smaller than 1.')}
        if(!_operations || _operations.length <= 0) {throw new Error(`"${JSON.stringify(_operations)}" is not a valid rotor config.`)}

        this.counter = 0;
        this.position = 1;
        this.thresh = Math.floor(_threshold);
        this.operations = _operations;
        this.mappings = this.generateMappings();
    }

    /**Generate a list of mappings for each rotor position based on the initial operations list. */
    private generateMappings():number[][][] {
        return this.operations.map(() => {
            
            /**Generate the list of value pairs. */
            const positions = this.operations.map((operation: number, index: number) => {
                const inVal = index + 1;
                return [inVal, this.normalize(inVal + operation)]
            }); 

            /**shift the operations list forward for next list*/
            let lastOperation = this.operations.pop();
            if (lastOperation !== undefined) {
                this.operations.unshift(lastOperation);
            };

            return positions;
        });
    }
    
    /**Normalize mutated value to 1-6 range and wrap around if needed.*/
    private normalize(value: number):number {
        const min = 1;
        const max = this.operations.length;
        const range = max - min + 1;

        return ((value - min) % range + range) % range + min;
    };

    /**Rotate the rotor one step */
    private rotate():void {
        if(this.position === this.mappings.length) {
            this.position = 1;
        } else {
            this.position++;
        }
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

        /**Get current rotor mapping */
        const mapping = this.mappings[this.position - 1];
        if(!mapping) {throw new Error(`Mapping for rotor position ${this.position} not found. The rotor config might be invalid.`)}
        
        /**find correct valuepair for the input */
        const selected = mapping.find(([inputValue, outputValue]) => {
            const selector = direction === 'FORWARD' ? inputValue : outputValue
            return  _input === selector;
        });
        
        // Check if an index was found.
        if(!selected) { throw new Error(`'${_input}' results in an invalid index.`) }

        const [input, output] = selected;
        return direction === 'FORWARD' ? output : input;
        
    }
}

export default Rotor;