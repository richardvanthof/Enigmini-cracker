import type Rotor from "../Rotor/Rotor"

class Enigmini {
    // Types
    keyMap: (string | string[])[][];
    plugBoard?: number[][];
    reflector?: number[][]
    rotors?: Rotor[];


    constructor(
        keyMap: (string | string[])[][],
        rotorsConfig: Rotor[],
        reflectorConfig?: number[][],
        plugBoard?: number[][],
      ) {

        
        this.keyMap = keyMap; //reverse rows to match axis-system from assignment.
        this.plugBoard = plugBoard;
        this.rotors = rotorsConfig;
        this.reflector = reflectorConfig;
        
        if(!keyMap) {throw new Error('Keymap not defined')}
        if(!rotorsConfig) {throw new Error('Rotors not defined')}
      }

      // findCharacterPosition(char: string):Pos {        
      //   if(!this.keyMap) {throw new Error('Key map undefined!')}
      //   this.keyMap.forEach((row, rowIndex) => {
      //     row.forEach((col, colIndex) => {
      //       const cell = this.keyMap[rowIndex][colIndex];
      //       const normalizedPos = {
      //         row: row + 1,
      //         col: col + 1
      //       };
            
      //       // Check if the selected cell has multiple items.
      //       if (Array.isArray(cell)) {
      //         // 
      //         if (cell.includes(char)) {
      //           return { ...normalizedPos, subIndex: cell.indexOf(char) }; // Include the index if the cell is an array
      //         }
      //       } else {
      //         // Otherwise, just check if it's the character
      //         if (cell === char) {
      //           return normalizedPos;
      //         }
      //       }
      //     })
      //   })
      // }
    
      // reflect(value: number) {
      //   if(!this.reflectorConfig) { throw new Error('Reflector config not found!')}
      //   const index = this.reflectorConfig.findIndex((val) => value === val[0]);
      //   const [input,output] = this.reflectorConfig[index]
      //   return output;
      // }
      
      // positionToChar(pos: Pos) {
      //   const { row, col, subIndex } = pos;
      //   const keyMap = this.keyMapNormalized
      //   const char = this.keyMap[row - 1][col - 1];
      //   if(subIndex) {
      //     return char[subIndex]
      //   } else {
      //     if(Array.isArray(char)) {
      //       return char[0]
      //     } else {
      //       return char
      //     }
      //   }
      //   return ; //Minus one since to account that the cordinates start at 1 instead of zero.
      // }
      
      // encryptCoordinate = (number:number):number => {
      //   let encrypted = number;
        
      //   console.log(`\nInitial value:`, encrypted)
        
      //   // Encryption pipeline (rotors -> reflector -> rotors (reverse order))
      //   const pipeline = [
      //     ...this.rotors.map((rotor:Rotor) => (input:number) => rotor.getValue(input)),
      //     (value: number) => this.reflect(value),
      //     ...this.rotors.reverse().map((rotor:Rotor) => (input:number) => rotor.getValue(input)),
      //   ]
        
      //   // Transport value through pipeline
      //   pipeline.forEach((step, index) => {
      //     encrypted = step(encrypted);
      //     console.log(`Crypt step #${index}:`, encrypted)
      //   })
        
      //   // update rotor counter and offset.
      //   this.rotors.forEach((rotor, index) => {
      //     console.log(`\nupdate rotor ${index}`)
      //     rotor.update(false)
      //   })
      //   return encrypted;
      // };
      
      // encrypt(plain: string) {
      //   // console.clear();
      //   console.log(this.rotors)
      //   // Normalize to UPPERCASE
      //   const normalizedPlain = plain.toUpperCase();
        
      //   let crypt = [];
        
      //   // DEBUG: transform object values to string.
      //   const objToStr = (obj:object) => Object.values(obj).join(",")
        
      //   // Loop through each character of string
      //   for (let char of normalizedPlain) {
      //     console.log('\n\nchar', char)
          
      //     // Find the position (ROW, COLUMN, SUBSTRING?] of the character in the key map
      //     let pos: Pos = this.findCharacterPosition(char);
      //     console.log('char pos [R,C,sS]:', objToStr(pos))
          
      //     // Encrypt each coordinate
      //     const encryptedPos = {
      //       ...pos,
      //       row: this.encryptCoordinate(pos.row),
      //       col: this.encryptCoordinate(pos.col)
      //     }
          
      //     // Transform coordinate to character
      //     const encryptedChar = this.positionToChar(encryptedPos);
          
      //     // Add encrypted character to cypher text.
      //     crypt.push(encryptedChar);
      //   }
    
      //   // Return the encrypted text
      //   return crypt.join("");
      // }
}

export default Enigmini;