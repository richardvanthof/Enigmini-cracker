import {describe, expect, it} from 'vitest';
import Enigmini from './Enigmini';
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
    
    // describe("char to pos", () => {
   
    //   it("handles single char", () => {
    //     console.log('handles single char')
    //     const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
    //     expect(enigmini.findCharacterPosition("A")).toEqual({ row: 4, col: 4 });
    //   });
      
    //   it("handles multiple chars", () => {
    //     const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
    //     let allCryptPos = [];
    //     const target=[{row:4,col:6},{row:3,col:4},{row:4,col:2},{row:3,col:4},{row:2,col:4,subIndex:1},{row:1,col:6},{row:6,col:1},{row:6,col:1},{row:4,col:3},{row:1,col:3},{row:3,col:4},{row:3,col:4},{row:5,col:3},{row:4,col:6},{row:5,col:6},{row:3,col:4},{row:2,col:2},{row:6,col:5},{row:5,col:6},{row:2,col:4,subIndex:1},{row:5,col:1},{row:6,col:5},{row:2,col:4,subIndex:1},{row:1,col:6},{row:3,col:4},{row:4,col:3},{row:6,col:4},{row:5,col:1},{row:3,col:6},{row:2,col:1},{row:3,col:4},{row:4,col:3},{row:4,col:6},{row:2,col:4,subIndex:1},{row:1,col:5},{row:3,col:4},{row:5,col:6},{row:2,col:4,subIndex:1},{row:4,col:6},{row:3,col:4},{row:2,col:4,subIndex:1},{row:3,col:4},{row:6,col:2},{row:5,col:1},{row:5,col:2},{row:1,col:5},{row:5,col:1},{row:6,col:2},{row:5,col:1},{row:6,col:3,subIndex:1}];
  
    //     for (let char of plain) {
    //       const cryptPos = enigmini.findCharacterPosition(char);
    //       allCryptPos.push(cryptPos);
    //     }
    //     expect(allCryptPos).toEqual(target);
    //   });
  
    //   it("handles special characters", () => {
    //     const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
    //     expect(enigmini.findCharacterPosition(";")).toEqual({
    //       row: 1,
    //       col: 1,
    //       subIndex: 1
    //     });
    //   });
    
    // })
  
      // it("translate pos to char", () => {
      //   const enigmini = new Enigmini(keymap, plugs, rotorConfig, reflector);
      //   expect(enigmini.positionToChar({ row: 6, col: 6 })).toBe("X");
      // });
  
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