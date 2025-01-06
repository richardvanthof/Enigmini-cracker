import type Rotor from "../Rotor/Rotor";
import { logToCSV } from "../../lib/Logger";
/**
 * Specifies coordinate for character in keymap
 */
export interface Pos {
  row: number,
  col: number,
  subIndex?: number
};

/**
 * Enigmini is a class that implements an Enigma-like encryption machine.
 * It uses a keyboard mapping, rotors, reflector and plugboard for encryption.
 * 
 * @example
 * ```typescript
 * const enigma = new Enigmini(keyMap, rotors, reflector, plugboard);
 * const encrypted = enigma.encrypt("HELLO WORLD");
 * ```
 * 
 * @remarks
 * The rotor config is an array of Rotor instances. This array should be in the correct order.
 * @public
 */
class Enigmini {
    // Types
    readonly keyMap: (string | string[])[][];
    readonly plugBoard?: number[][];
    readonly reflector?: number[][]
    readonly rotors: Rotor[];
    log: Map<string, any>[];

    constructor(
        keyMap: (string | string[])[][],
        rotorsConfig: Rotor[],
        reflectorConfig?: number[][],
        plugBoard?: number[][],
      ) {
        // Validate inputs
        if(!keyMap) {throw new Error('Keymap not defined')}
        if(!rotorsConfig) {throw new Error('Rotors not defined')}


        this.keyMap = structuredClone(keyMap);
        this.plugBoard = plugBoard;
        this.rotors = rotorsConfig;
        this.reflector = reflectorConfig;
        this.log = [];

      }
      /** 
       * Search for single (special) character or number in the keymap 
       * and returns it's column and row number.
       * */
      findCharacterPosition(char: string):Pos {   
        const keyMap = this.keyMap;
        let normalizedPos;
        let normalizedChar = char.toUpperCase();
        // log(keyMap);
        // Loop trough each cell in the keymap
        keyMap.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => { 

            // check if cell is an array
            if(Array.isArray(col)) {
              // if it is, check if it contains the target character.
              if (col.includes(normalizedChar)) {
                // log({col, rowIndex, colIndex})
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
                // log({col, rowIndex, colIndex})
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
          throw new Error(`Character '${normalizedChar}' not found in keymap.`);
        }

        return normalizedPos;
      }
      
      /**Translates position to character from keymap */
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
      
          throw new Error(`Invalid cell content '${cell}' at row ${pos.row} and col ${pos.col}].`);
      }
      
      /**Remap one value to a prespecified other value */
      remapValue(value: number|string, map:number[][], reverse: boolean = false):number {
        // Input validation
        if (!map) { throw new Error('Remap config not found!') }
        if (value === undefined || value === null) { throw new Error('Input value not found!') }

        const index = map.findIndex((val) => value === (reverse ? val[1] : val[0]));
        if (index === -1) { throw new Error(`Value ${value} not found in map!`) }
        return reverse ? map[index][0] : map[index][1];
      }

    
      /** If applies additional substitution cypher when plugboard is configured.*/
      applyPlugBoard = (value:number):number => {
        if(this.plugBoard && this.plugBoard.some((element) => {
          // check if value is on index 0 of plugboard items
          return element[0] === value 
        })) {
          // if value is in a plugboard, remap it.
          const result = this.remapValue(value, this.plugBoard);
          // log({plugboard: result})
          return result;
        } else {
          // if value is not in a plugboard, pass it through.
          return value;
        }
      };

      /** Specifies if rotors should be applied in default or reversed order. */
      private getRotorsInOrder(reverse: boolean = false): Rotor[] {
        return reverse ? [...this.rotors].reverse() : [...this.rotors];
      }
      
      /**Encrypt/decrypt single digit (often character position coordinate). */
      encypherDigit = (number:number, debug:string|false = false):number => {
        this.log.push(new Map());
        const log = this.log[this.log.length - 1];

        if(!number || typeof(number) != 'number') {throw new Error('No valid input value provided!')}

        if(debug) {
          log.set('updated', this.rotors[0].counter)
          this.rotors.forEach((rotor:Rotor, index) => log.set(`Rotor ${index+1} position`, rotor.position))
          log.set('Coordinate', number)
        }

        let result = number;
        // encryption pipeline
        
        // 1. apply plugboard
        result = this.applyPlugBoard(result);  // apply plugboard
        (debug && this.plugBoard) && log.set('> Plugboard', result);
        // 2. Rotors forward
        this.getRotorsInOrder().forEach((rotor, index) => {
          result = rotor.getValue(result, 'FORWARD');
          debug && log.set(`> Rotor ${index+1}`, result);
        });

        // 3. apply reflector
        if(this.reflector) {
          result = this.remapValue(result, this.reflector); // apply reflector
          debug && log.set('Reflector', result);
        }
        
        // 4. Rotors backward
        this.getRotorsInOrder(true).forEach((rotor, index) => {
          result = rotor.getValue(result, 'REVERSE');
          debug && log.set(`< Rotor ${this.rotors.length - (index)}`, result);
        });
        
        // 5. apply plugboard*
        // result = this.applyPlugBoard(result);
        
        // *AIVD: Bij opgave 14 zijn we vergeten te vermelden dat de leider van 
        // het ontcijferingsteam van Piconesië ontdekte dat het stekkerbord 
        // verkeerd is geïmplementeerd en maar in één richting werkt. 
        // In de andere richting wordt het stekkerbord overgeslagen.
        
        // Update rotor counters
        this.rotors.forEach((rotor:Rotor) => rotor.update());
        //If available, apply plugboard
        return result;
      };
      
      /**Encrypt/decrypt string */
      encypher(plain: string, debug: string|false = false) {
        let allLogs:Map<string,unknown>[] = [];
        /**Normalize string to UPPERCASE*/
        let normalizedPlain = plain.toUpperCase().split('');
        let result:string[] = [];
        const delimiter = '#';

        // Loop through each character of string

        normalizedPlain.forEach((_char, index) => {	
          
          // replace spaces with #-character
          const char = _char.replace(' ', delimiter);
          
          /** Find the position (ROW, COLUMN, SUBSTRING?] 
           * of the character in the key map */
          const pos: Pos = this.findCharacterPosition(char);
          
          /**Encypher each coordinate. */
          const encryptedPos = {
            ...pos,
            row: this.encypherDigit(pos.row, debug),
            col: this.encypherDigit(pos.col, debug)
          }

          /**Transform coordinate to character. */
          let encryptedChar:string = this.positionToChar(encryptedPos);
          
          if(!encryptedChar) {
            throw new Error(`Missing char '${char}'`)
          }
          
          /**Log all actions to a csv for debugging.*/
          if(debug && typeof debug === 'string') {
            const targetChar = debug[index];
            const targetPosition:number[] = Object.values(this.findCharacterPosition(targetChar));
            const pos = [encryptedPos.row, encryptedPos.col];

            this.log.forEach((coordinateLog, index) => {
              this.log[index] = new Map([
                ['Character IN', char],
                ...coordinateLog,
                ['Character OUT', encryptedChar],
                ['Target coordinate', targetPosition[index]],
                ['Target character', targetChar],
                ['Match', (pos[index] === targetPosition[index])]
              ]);
            });
            allLogs.push(...this.log);
            this.log = [];
          };

          // Add encrypted character to cypher text.
          result.push(encryptedChar);
    
        });

        debug && logToCSV(allLogs, `logs/log-${new Date().getTime()}.csv`);
        // Return the encrypted text
        return result.join("");
      }

      encrypt(plain: string, debug: string|false = false) {

        return this.encypher(plain, debug);
      };

      decrypt(cypher: string, debug: string|false = false) {
        return this.encypher(cypher, debug);
      };
}

export default Enigmini;