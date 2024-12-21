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
    
      positionToChar(pos: Pos): string {
          // Input validation
          if (!pos || typeof pos.row !== 'number' || typeof pos.col !== 'number') {
              throw new Error('Invalid position provided');
          }
      
          // Get array indices (convert from 1-based to 0-based)
          const rowIndex = pos.row - 1;
          const colIndex = pos.col - 1;
      
          // Get cell from keymap
          const cell = this.keyMap[rowIndex][colIndex];
          
          // Handle array cell (special characters)
          if (Array.isArray(cell)) {
              // If subIndex specified, try to get that character
              if (typeof pos.subIndex === 'number') {
                  // Return subIndex char if exists, otherwise primary char
                  return cell[pos.subIndex] ?? cell[0];
              }
              // No subIndex, return primary character
              return cell[0];
          }
      
          // Handle string cell (regular characters)
          if (typeof cell === 'string') {
              return cell;
          }
      
          throw new Error(`Invalid cell content at position [${pos.row},${pos.col}]`);
      }
      
      remapValue(value: number|string, map:number[][], reverse: boolean = false):number {
        // Input validation
        if (!map) { throw new Error('Remap config not found!') }
        if (value === undefined || value === null) { throw new Error('Input value not found!') }

        const index = map.findIndex((val) => value === (reverse ? val[1] : val[0]));
        if (index === -1) { throw new Error(`Value ${value} not found in map!`) }
        return reverse ? map[index][0] : map[index][1];
      }

    
      // if plugboard is available && value is in plugbard: apply it.
      applyPlugBoard = (value:number):number => {
        if(this.plugBoard && this.plugBoard.some((element) => {
          // check if value is on index 0 of plugboard items
          return element[0] === value 
        })) {
          // if value is in a plugboard, remap it.
          const result = this.remapValue(value, this.plugBoard);
          console.log({plugboard: result})
          return result;
        } else {
          // if value is not in a plugboard, pass it through.
          return value;
        }
      };

      private getRotorsInOrder(reverse: boolean = false): Rotor[] {
        return reverse ? [...this.rotors].reverse() : [...this.rotors];
      }

      encryptDigit = (number:number, debug?:boolean):number => {
        if(!number || typeof(number) != 'number') {throw new Error('No valid input value provided!')}

        debug && console.log(`\n## Processing "${number}"`)
        this.rotors.forEach((rotor:Rotor, index) => {

          debug && console.log({rotor: {
            counter: rotor.counter, 
            offset: rotor.offset, 
            thresh: rotor.thresh,
            id: index+1,
          }})
        });
        debug && console.log('\n#### Encoding cycle')
        let result = number;
        debug && console.log({input: result})
        // encryption pipeline
        
        // 1. apply plugboard
        result = this.applyPlugBoard(result);  // apply plugboard
        
        // 2. Rotors forward
        this.getRotorsInOrder().forEach((rotor, index) => {
          result = rotor.getValue(result);
          debug && console.log({rotor: index+1, result});
        });

        // 3. apply reflector
        if(this.reflector) {
          result = this.remapValue(result, this.reflector); // apply reflector
          debug && console.log({reflector: result})
        }
        
        // 4. Rotors backward
        this.getRotorsInOrder(true).forEach((rotor, index) => {
          result = rotor.getValue(result, 'REVERSE');
          debug && console.log({rotor: index+1, result});
        });
        
        // 5. apply plugboard*
        // result = this.applyPlugBoard(result);
        
        // *AIVD: Bij opgave 14 zijn we vergeten te vermelden dat de leider van 
        // het ontcijferingsteam van Piconesië ontdekte dat het stekkerbord 
        // verkeerd is geïmplementeerd en maar in één richting werkt. 
        // In de andere richting wordt het stekkerbord overgeslagen.
        debug && console.log({result});
        
        // Update rotor counters
        this.rotors.forEach((rotor:Rotor) => rotor.update());
        
        //If available, apply plugboard
        return result;
      };
      
      
      encrypt(plain: string, debug: boolean = false) {

        // Normalize to UPPERCASE
        const normalizedPlain = plain.toUpperCase();
        let counter = 1;
        let result = [];
        const delimiter = '#';
        
        // Loop through each character of string
        for (let _char of normalizedPlain) {
          // replace spaces with #-character
          const char = _char.replace(' ', delimiter)
          debug && console.log(`\n\n# Encrypting '${char}'`)
          // Find the position (ROW, COLUMN, SUBSTRING?] 
          // of the character in the key map
          const pos: Pos = this.findCharacterPosition(char);
          debug && console.log(pos)
          // Encrypt each coordinate
          const encryptedPos = {
            ...pos,
            row: this.encryptDigit(pos.row, debug),
            col: this.encryptDigit(pos.col, debug)
          }

          // Transform coordinate to character
          let encryptedChar:string = this.positionToChar(encryptedPos);
          debug && console.log('\n## Result')
          debug && console.log({...encryptedPos, encryptedChar})
          
          if(!encryptedChar) {
            throw new Error(`Missing char '${char}' at index: ${counter}`)
          }

          // if(typeof encryptedChar !== 'string') {
          //   throw new Error(`'${char}' (at index: ${counter}) is not a string.`)
          // }
          
          // replace space delimiter with ' '
          encryptedChar = encryptedChar.replace(delimiter, ' ');

          // Add encrypted character to cypher text.
          result.push(encryptedChar);
          counter++;
        }
        
        // Return the encrypted text
        return result.join("");
      }
}

export default Enigmini;