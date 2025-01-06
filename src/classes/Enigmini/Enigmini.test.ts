import {describe, expect, it} from 'vitest';
import Enigmini from './Enigmini';
import type {Pos} from './Enigmini';
import Rotor from '../Rotor/Rotor';


// Test data
// # = replacement for sppace (aka. ' ').
const keymap = [
    ["O", "N", ["1", "!"], "C", "S", "X"],
    ["I", "G", "L", ["3", "."], "H", "T"],
    [["5", '"'], "Z", "R", "A", ["8", ","], "D"],
    ["P", ["6", ":"], "W", "E", ["2", "?"], "J"],
    ["F", "K", "U", ["0", " "], "Y", "Q"],
    [["9", ";"], ["7", "_"], "B", ["4", "’"], "M", "V"]
];

const reflector = [
  [1, 5],
  [2, 4],
  [3, 6],
  [4, 2],
  [5, 1],
  [6, 3]
];

const rotor1 = [1, 3, 1, 2, 2, 3];
const rotor2 = [2, -1, 2, 2, 3, -2];

const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const crypt = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";


describe("Enigmini", () => {

  describe("Constructor validation", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];

    it("creates instance", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini).toBeInstanceOf(Enigmini);
    });

    it("throws error for missing keymap", () => {
      expect(() => new Enigmini(null as any, rotorConfig, reflector))
      .toThrow('Keymap not defined');
    });

    it("throws error for missing rotors", () => {
      expect(() => new Enigmini(keymap, null as any, reflector))
      .toThrow('Rotors not defined');
    });
  });
    
  describe("char to pos", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    it("handles single char", () => {
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      const charPos:Pos = enigmini.findCharacterPosition("K")
      expect(charPos).toEqual({ row: 5, col: 2 });
    });

    it("ignores letter casing", () => {
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      const charPos:Pos = enigmini.findCharacterPosition("k") // ignores case.
      expect(charPos).toEqual({ row: 5, col: 2 });
    });

    it("throws error for unknown character", () => {
      const target = '@';
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      expect(()=>enigmini.findCharacterPosition(target))
      .toThrow(`Character '${target}' not found in keymap.`);
    });

  
    
    it("handles multiple chars", () => {
      const string = "DEZE";
      const target = [
        { row: 3, col: 6 }, // D
        { row: 4, col: 4 }, // E
        { row: 3, col: 2 }, // Z
        { row: 4, col: 4 }  // E
      ];
      
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);

      const allPos = string.split("").map((char:string) => {
        
        return enigmini.findCharacterPosition(char)
      })
      
      expect(allPos).toStrictEqual(target);
    });

    it("handles fetching special characters", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini.findCharacterPosition(";")).toEqual({
        row: 6,
        col: 1,
        subIndex: 1
      });
    });    
  })

  describe("pos to char", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    it("translate pos to char", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini.positionToChar({ row: 6, col: 6 })).toBe("V"); // fetch char
      
      expect(enigmini.positionToChar({ row: 6, col: 1, subIndex: 1 })).toBe(";"); // fetch special char.
    });

    it("replace missing secondary with primary character.", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      expect(enigmini.positionToChar({ row: 2, col: 2, subIndex: 1 })).toBe("G");
      
      expect(enigmini.positionToChar({ row: 2, col: 2, subIndex: 0 })).toBe("G");
    });

    // it('Throws error if no valid char is returned', ()=> {
    //   const enigmini = new Enigmini(keymap, rotorConfig, reflector);
    //   expect(enigmini.positionToChar({row: 100, col:100}))
    //   .toThrow(`Invalid cell content 'undefined' at row 100 and col 100.`)
    // })

  })

  describe("remap value", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    it("remaps value (forwards)", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      const result = enigmini.remapValue(1, reflector);
      expect(result).toBe(5);
    });

    it("remaps value (backwards)", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      const result = enigmini.remapValue(1, reflector, 'REVERSE');
      expect(result).toBe(5);
    });

    it('remaps value (symmetric: looks value on both sides)', () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      const map = [
        [1,2],
        [3,4]
      ]

      /**1 (at index 0) should be remapped to 2*/
      let result = enigmini.remapValue(1, map, 'SYMMETRIC');
      expect(result).toBe(2);

      /** 4 (at index 1) should be rempapped to 3*/
      result = enigmini.remapValue(4, map, 'SYMMETRIC');
      expect(result).toBe(3);
    })

    it("throws error for unknown character", () => {
      const target = 999;
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      
      expect(()=>enigmini.remapValue(target, reflector))
      .toThrow(`Value ${target} not found in map!`);
    });

    it("throws error for undefined map", () => {
      const target = 1;
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);

      // remap config is undefined
      
      expect(()=>enigmini.remapValue(target, null as any))
      .toThrow('Remap config not found!');
    });

    it("throws error for undefined input value", () => {
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);

      // input value is undefined
      
      expect(()=>enigmini.remapValue(null as any, reflector)) 
      .toThrow('Input value not found!');
    });
  })

  describe("encrypt single digits", () => {
    // This test block requires a shared Enigmini instance.
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    const enigmini = new Enigmini(keymap, rotorConfig, reflector);

    it("checks for valid input", () => {
      const error = 'No valid input value provided!';
      
      expect(()=> enigmini.encypherDigit(null as any)).toThrow(error);
      // @ts-expect-error - Testing for invalid input
      expect(()=> enigmini.encypherDigit('1')).toThrow(error);
    });
    
    it("encrypt row digit", () => {
      // From the example text we know that D should be encrypted to K.
      // The character D is located at row 4, K at row 2
      
      expect(enigmini.encypherDigit(4, false)).toBe(2);
      
    });

    it("encrypt col digit", () => {
      
      expect(enigmini.encypherDigit(6)).toBe(2);
      // The character D is located at col 6, K at col 2
    });

  });
  
  describe("encryption/decryption", () => {
    it("encrypt/decrypt single character", async () => {
      const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(await enigmini.encrypt('D')).toBe('K'); // Encrypt
    });

    it("encrypt/decrypt scentence", async () => {
      const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);

      expect(await enigmini.decrypt(crypt)).toBe(plain); // Encrypt
    });                                              
  })

  describe('Delimits input', ()=> {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    const enigmini = new Enigmini(keymap, rotorConfig, reflector);

    it('creates special characters map', ()=> {
      const target = [
        ["0", ' '],
        ["1", '!'],
        ["2", '?'],
        ["3", '.'],
        ["4", "’"],
        ["5", '"'],
        ["6", ':'],
        ["7", '_'],
        ["8", ','],
        ["9", ';']
      ];
      expect(enigmini.getSpecialCharsMap()).toStrictEqual(target)
    });

    it('delimits cypher (decryption)', ()=> {
      
      expect(enigmini.delimit('1234567890', 'REVERSE')).toBe(`!?.’":_,; `);
    });

    it('delimits plain (encryption)', ()=> {
      
      expect(enigmini.delimit(`!?.’":_,; `, 'DEFAULT')).toBe('1234567890');
    });
  });

  describe('Plugboard', () => {
    const plugBoard = reflector;
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugBoard);
    it('plugboard scrambled (direction: forward)', () => {
      /**Input coordinates (row, column) */
      const input = [
        3,6, // D
        4,4, // E
        3,2, // Z
        4,4  // E
      ];
      /**Scrambled output */
      const output = [
        6,3, // D
        2,2, // E
        6,4, // Z
        2,2  // E
      ];
      
      expect(input.map(coordinate => enigmini.applyPlugBoard(coordinate))).toStrictEqual(output)
    })

    it('handles partially filled plugboard', () => {
      /**Input coordinates (row, column) */
      const input = [
        3,6, // D
        4,4, // E
        3,2, // Z
        4,4  // E
      ];
      /**Scrambled output */
      const output = [
        6,3, // D
        2,2, // E
        6,4, // Z
        2,2  // E
      ];
      
      expect(input.map(coordinate => enigmini.applyPlugBoard(coordinate))).toStrictEqual(output)
    })

    it('plugboard scrambled (direction: reverse)', () => {
      const partialPlugs = [
        [1, 5],
        [3, 6],
        [5, 1],
        [6, 3]
      ];
      
      const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector, partialPlugs);
      
      /**Input coordinates (row, column) */
      const input = [
        3,6, // D
        4,4, // E
        3,2, // Z
        4,4  // E
      ];
      /**Scrambled output */
      const output = [
        6,3, 
        4,4, 
        6,2,
        4,4 
      ];
      
      expect(input.map(coordinate => enigmini.applyPlugBoard(coordinate))).toStrictEqual(output)
    })
  })
});

