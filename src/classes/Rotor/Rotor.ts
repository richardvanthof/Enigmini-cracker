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

    update(debug:boolean=false):void {
        // Debug log
        if(debug) {
            console.log({
            counter: this.counter,
            thresh: this.thresh,
            offset: this.offset
            })
        }
        // Update counter
        this.counter++;

        // Check if counter passes the rotate threshold
        if (this.counter % this.thresh === 0 || this.thresh === 1) {
            this.offset++
            if(this.offset === +0 || this.offset === -0) {this.offset = 0}
        }

        //     // Calculate new offset
        //     // If the offset will loop around if it becomes greater 
        //     // than the mapping config length.
        //     // Calculate new offset using modular arithmetic for wrapping
        //     const mappingLength = this.mapping.length;
        //     this.offset = (this.offset - 1 + mappingLength) % mappingLength;
            
        //     //Normalize -0 to 0
        //     if(this.offset === -0 || this.offset === +0) {this.offset = 0}

        // }
    }

    getOffset(currentPair: number[]):number {
        // remove all list looparounds
        let corrected = this.offset % this.mapping.length
        // check if final offset position is greater than the remainder of the list
        const currentValueIndex = currentPair[0]
        if(corrected >= currentValueIndex) {
            return (this.mapping.length - (corrected - currentValueIndex)) * -1
        } else {
            return corrected * - 1
        }
    }

    getValue(input:number):number {
        const index = this.mapping.findIndex(([source]) => source === input);
        const adjustedIndex = index + this.offset;
        const newVal = this.mapping[adjustedIndex][1];
        // console.log(input, index, newVal)
        return newVal;
    }

}

export default Rotor;