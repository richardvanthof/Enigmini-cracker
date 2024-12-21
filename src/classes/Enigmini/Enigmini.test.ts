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
    ["F", "K", "U", ["0", "#"], "Y", "Q"],
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

const rotor1 = [
  [1, 2],
  [2, 5],
  [3, 4],
  [4, 6],
  [5, 1],
  [6, 3]
];

const rotor2 = [
  [1, 3],
  [2, 1],
  [3, 5],
  [4, 6],
  [5, 2],
  [6, 4]
];


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
      expect(() => new Enigmini(null as any, rotorConfig, reflector)).toThrow('Keymap not defined');
    });

    it("throws error for missing rotors", () => {
      expect(() => new Enigmini(keymap, null as any, reflector)).toThrow('Rotors not defined');
    });
  });
    
  describe("char to pos", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    it("handles single char", () => {
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      const charPos:Pos = enigmini.findCharacterPosition("K")
      expect(charPos).toEqual({ row: 2, col: 2 });
    });

    it("ignores letter casing", () => {
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      const charPos:Pos = enigmini.findCharacterPosition("k") // ignores case.
      expect(charPos).toEqual({ row: 2, col: 2 });
    });

    it("throws error for unknown character", () => {
      const target = '@';
      const enigmini:Enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(()=>enigmini.findCharacterPosition(target)).toThrow(`Character ${target} not found in keymap.`);
    });

  
    
    it("handles multiple chars", () => {
      const string = "DEZE";
      const target = [
        { row: 4, col: 6 }, // D
        { row: 3, col: 4 }, // E
        { row: 4, col: 2 }, // Z
        { row: 3, col: 4 }  // E
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
        row: 1,
        col: 1,
        subIndex: 1
      });
    });    
  })

  describe("pos to char", () => {
    const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
    it("translate pos to char", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini.positionToChar({ row: 6, col: 6 })).toBe("X"); // fetch char
      expect(enigmini.positionToChar({ row: 1, col: 1, subIndex: 1 })).toBe(";"); // fetch special char.
    });

    it("replace missing secondary with primary character.", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini.positionToChar({ row: 2, col: 2, subIndex: 1 })).toBe("K");
    });

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
      const result = enigmini.remapValue(1, reflector, true);
      expect(result).toBe(5);
    });

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
      expect(()=> enigmini.encryptDigit(null as any)).toThrow(error);
      // @ts-expect-error - Testing for invalid input
      expect(()=> enigmini.encryptDigit('1')).toThrow(error);
    });
    
    it("encrypt row digit", () => {
      // From the example text we know that D should be encrypted to K.
      // The character D is located at row 4, K at row 2
      expect(enigmini.encryptDigit(4)).toBe(2);
      
    });

    it("encrypt col digit", () => {
      // The character D is located at col 6, K at col 2
      expect(enigmini.encryptDigit(6)).toBe(2);
    });

  });
  
  describe("encryption/decryption", () => {
    it("encrypt/decrypt single character", () => {
      const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);

      const plain = 'D';
      const cypher = 'K';
      expect(enigmini.encrypt(plain, true)).toBe(cypher); // Encrypt
    });

    it("encrypt/decrypt full scentence", () => {
      const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);

      expect(enigmini.encrypt(plain)).toBe(crypt); // Encrypt
    });
  })
});