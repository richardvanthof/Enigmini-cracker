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

    getIndex(index: number): number {
        const mapLength = this.mapping.length;
        
        // NORMALIZE OFFSET TO BE WITHIN [0, mapLength)
        // - First %: Handle offsets larger than mapLength
        // - mapLength: Make negative numbers positive
        // - Second %: Ensure result is within [0, mapLength)
        const normalizedOffset = ((this.offset % mapLength) + mapLength) % mapLength; // Handle negative offsets
        
        // CALCULATE NEW INDEX WITH RAP AROUND
        // - index - normalizedOffset: Shift by rotation amount
        // - mapLength: Prevent negative results
        // - mapLength: Wrap around to stay in bounds
        let newIndex = (index - normalizedOffset + mapLength) % mapLength;


        return newIndex;
    }
    
    getValue(input:number):number {
        // Find input position in mapping
        const index = this.mapping.findIndex(([source]) => source === input);
        if(index === -1) { throw new Error('Invalid input') }
        
        // Get rotated position
        const adjustedIndex = this.getIndex(index);
        
        // Get mapped value at rotated position
        const newVal = this.mapping[adjustedIndex][1];
        return newVal;
    }
    
}

export default Rotor;