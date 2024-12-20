import {describe, expect, it} from 'vitest';
import Enigmini from './Enigmini';
import type {Pos} from './Enigmini';
import Rotor from '../Rotor/Rotor';


// Test data
const keymap = [
    ["O", "N", ["1", "!"], "C", "S", "X"],
    ["I", "G", "L", ["3", "."], "H", "T"],
    [["5", '"'], "Z", "R", "A", ["8", ","], "D"],
    ["P", ["6", ":"], "W", "E", ["2", "?"], "J"],
    ["F", "K", "U", ["0", " "], "Y", "Q"],
    [["9", ";"], ["7", "_"], "B", ["4", "’"], "M", "V"]
];

const plugs = null;

const reflector = [
  [1, 5],
  [2, 4],
  [3, 6],
  [4, 2],
  [5, 1],
  [6, 3]
];

const rotor1 = new Rotor(
  [
    [1, 2],
    [2, 5],
    [3, 4],
    [4, 6],
    [5, 1],
    [6, 3]
  ], 1);

const rotor2 = new Rotor([
  [1, 3],
  [2, 1],
  [3, 5],
  [4, 6],
  [5, 2],
  [6, 4]
], 6);
const rotorConfig = [rotor1, rotor2];

const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const crypt = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";


describe("Enigmini", () => {

  describe("Init Enigmini", () => {
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
  
      it("handles special characters", () => {
        const enigmini = new Enigmini(keymap, rotorConfig, reflector);
        expect(enigmini.findCharacterPosition(";")).toEqual({
          row: 1,
          col: 1,
          subIndex: 1
        });
      });
    
    })
  
    it("translate pos to char", () => {
      const enigmini = new Enigmini(keymap, rotorConfig, reflector);
      expect(enigmini.positionToChar({ row: 6, col: 6 })).toBe("X");
    });
  
      // it('reflector translates values', () => {
      //   const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
      //   reflector.forEach(([input,target]) => {
      //     expect(enigmini.reflect(input)).toBe(target)
      //   })
      // })
    
    // describe("encrypts", () => {
    //   const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
      
    //   // it("one characer", () => {
    //   //   expect(enigmini.encrypt('D')).toBe('K');
    //   // });
  
    //   // it("full scentence", () => {
    //   //   expect(enigmini.encrypt(plain)).toBe(crypt);
    //   // });
    // })
});