import type Rotor from "../Rotor/Rotor"

export interface Pos {
  row: number,
  col: number,
  subIndex?: number
}

class Enigmini {
    // Types
    readonly keyMap: (string | string[])[][];
    readonly plugBoard?: number[][];
    readonly reflector?: number[][]
    readonly rotors: Rotor[];

    constructor(
        keyMap: (string | string[])[][],
        rotorsConfig: Rotor[],
        reflectorConfig?: number[][],
        plugBoard?: number[][],
      ) {
        // Validate inputs
        if(!keyMap) {throw new Error('Keymap not defined')}
        if(!rotorsConfig) {throw new Error('Rotors not defined')}


        this.keyMap = structuredClone(keyMap).reverse();
        this.plugBoard = plugBoard;
        this.rotors = rotorsConfig;
        this.reflector = reflectorConfig;

      }

      findCharacterPosition(char: string):Pos {   
        const keyMap = this.keyMap;
        let normalizedPos;
        let normalizedChar = char.toUpperCase();
        // console.log(keyMap);
        // Loop trough each cell in the keymap
        keyMap.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => { 

            // check if cell is an array
            if(Array.isArray(col)) {
              // if it is, check if it contains the target character.
              if (col.includes(normalizedChar)) {
                // console.log({col, rowIndex, colIndex})
                normalizedPos = {
                  
                  // Position is normalized to start counting 
                  // from 1 instead of 0.
                  row: rowIndex + 1, 
                  col: colIndex + 1, 
                  subIndex: col.indexOf(normalizedChar)
                }
              }
            } else {
              // if not, just check if the cell is the target character.
              if(col === normalizedChar) {
                // console.log({col, rowIndex, colIndex})
                // Position is normalized to start counting 
                // from 1 instead of 0.
                normalizedPos = {
                  row: rowIndex + 1, 
                  col: colIndex + 1
                }
              } 
            }
          })
        });

        if(!normalizedPos) {
          throw new Error(`Character ${normalizedChar} not found in keymap.`);
        }

        return normalizedPos;
      }
    
      positionToChar(pos: Pos) {
        const { row, col, subIndex } = pos;

        // coordinates are normalized to start counting from 1 instead of 0.
        // subtract one to get the correct index.
        const char = this.keyMap[row - 1][col - 1];
        
        if(subIndex) {
          return char[subIndex]
        } else {
          if(Array.isArray(char)) {
            return char[0]
          } else {
            return char
          }
        }
      }
      
      remapValue(value: number|string, map:number[][]):number {
        // Input validation
        if(!map) { throw new Error('Remap config not found!')}
        if(!value) { throw new Error('Input value not found!')}

        const index = map.findIndex((val) => value === val[0]);
        if(index === -1) { throw new Error(`Value ${value} not found in map!`)}
        return map[index][1];
      }

      encryptDigit = (number:number):number => {
        if(!number || typeof(number) != 'number') {
          throw new Error('No valid input value provided!')
        }

        let result = number;

        // if plugboard is available && value is in plugbard: apply it.
        const applyPlugBoard = (value:number):number => {
          if(this.plugBoard && this.plugBoard.some((element) => {
            // check if value is on index 0 of plugboard items
            return element[0] === value 
          })) {
            // if value is in a plugboard, remap it.
            return this.remapValue(value, this.plugBoard);
          } else {
            // if value is not in a plugboard, pass it through.
            return value;
          }
        };
        

        // encryption pipeline
        
        // 1. apply plugboard
        result = applyPlugBoard(result);  // apply plugboard
        
        // 2. apply rotors
        this.rotors.forEach((rotor:Rotor) => {
          result = rotor.getValue(result)
        });

        // 3. apply reflector
        if(this.reflector) {
          result = this.remapValue(result, this.reflector); // apply reflector
        }

        // 4. apply rotors in reverse order (without changing global rotor order)
        for(let index = this.rotors.length - 1; index >= 0; index--) {
          const rotor = this.rotors[index];
          result = rotor.getValue(result)
        }

        // 5. apply plugboard
        result = applyPlugBoard(result);  // apply plugboard
        
        // Update rotor counters
        this.rotors.forEach((rotor:Rotor) => {
          rotor.update()
        });

        //If available, apply plugboard
        return result;
      };
      
      
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