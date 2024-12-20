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
        const normalizedOffset = ((this.offset % mapLength) + mapLength) % mapLength; // Handle negative offsets
        
        // Calculate new index with wrap-around
        let newIndex = (index - normalizedOffset + mapLength) % mapLength;
        
        return newIndex;
    }
    
    getValue(input:number):number {
        
        // Fetch input character from mapping
        const index = this.mapping.findIndex(([source]) => source === input) || null;
        
        const adjustedIndex = this.getIndex(index);
        const newVal = this.mapping[adjustedIndex][1];
        // console.log(input, index, newVal)
        return newVal;
    }
    
}

export default Rotor;