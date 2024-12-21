class Rotor {
    // Types
    counter: number;
    offset: number;
    thresh: number;
    mapping: number[][];

    constructor(
        mapping:number[][], 
        threshold:number=1
    ) {
        if(threshold < 1) {throw new Error('Threshold cannot be smaller than 1.')}
        if(!mapping) {throw new Error('Mapping config not defined.')}

        this.counter = 0;
        this.offset = 0;
        this.thresh = Math.floor(threshold);
        this.mapping = mapping
    }

    update():void {
        // Update counter
        this.counter++;

        // Check if counter passes the rotate threshold
        if (this.counter % this.thresh === 0 || this.thresh === 1) {
            this.offset++
            if(this.offset === +0 || this.offset === -0) {this.offset = 0}
        }
    }

    applyOffsetTo(index: number): number {
        // subtracts offset from the index of the targeted list item.
        // the rotor (aka the target values) are moving clockwise,
        // therefore, from the perspective of the source values, they 
        // are moving counter-clockwise (aka. in the negative direction).
        // Thus we need to subtract the offset from the index.

        const mapLength = this.mapping.length;
        
        const offset = ((this.offset % mapLength) + mapLength) % mapLength;;
        // - First %: Handle offsets larger than mapLength
        // - mapLength: Make negative numbers positive
        // - Second %: Ensure result is within [0, mapLength])

        let newIndex = index - offset;
        if(newIndex < 0) {
            newIndex = mapLength + newIndex;
        }
        return newIndex;
    }

    setOffset(offset: number): void {
        this.offset = offset;
    }
    
    getValue(input:number, mode: 'FORWARD' | 'REVERSE' = 'FORWARD'):number {
        // Find the entry in the list of coupled numbers.
        // mode === forward: check against the input value.
        // mode === reverse: check against the output value 
        const index = this.mapping.findIndex(([source, target]) => {
            const currentVal = mode === 'FORWARD' ? source : target;
            return input === currentVal;
        });
        
        // Check if an index was found.
        if(index === -1) { throw new Error('Invalid input') }
        
        // Get rotated position
        const adjustedIndex = this.applyOffsetTo(index);
        
        // Get mapped value at rotated position
        const newVal = this.mapping[adjustedIndex][mode === 'REVERSE' ? 0 : 1];
        return newVal;
    }
}

export default Rotor;