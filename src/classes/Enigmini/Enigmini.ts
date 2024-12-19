class Enigmini {
    // Types
    keyMap: (string | string[])[]
    plugBoard?: number[][]
    rotorsConfig?: object[]
    reflectorConfig?: number[]
    rotors?: object[]
    counter: number

    constructor(
        keyMap: (string | string[])[],
        plugBoard?: number[][],
        rotorsConfig?: object[],
        reflectorConfig?: number[]
      ) {
        if (!keyMap) { throw new Error('Key map is undefined.')};
        this.keyMap = keyMap; //reverse rows to match axis-system from assignment.
        this.plugBoard = plugBoard;
        this.rotors = rotorsConfig;
        this.reflectorConfig = reflectorConfig;
        this.counter = 0
      }
}

export default Enigmini;