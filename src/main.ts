import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';
import {saveToFile} from './lib/Logger.ts';

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
[1, 2, 1],
[2, 5, 3],
[3, 4, 1],
[4, 6, 2],
[5, 1, 2],
[6, 3, 3]
];

const rotor2 = [
[1, 3, 2],
[2, 1, -1],
[3, 5, 2],
[4, 6, 2],
[5, 2, 3],
[6, 4, -2]
];

// Reference string
const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const cypher = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";

const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
const rotorConfig2 = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];

const enigmini = new Enigmini(keymap, rotorConfig, reflector);
const enigmini2 = new Enigmini(keymap, rotorConfig2, reflector);

console.log(`
# Enigmini results
0. prove that encryption algorithm works

encrypt:
REF: ${cypher} 
RES: ${enigmini.encypher(plain)}

decrypt:
REF: ${plain}
RES: ${enigmini2.encypher(cypher)}
`)

// const rotorA = new Rotor(rotor1, 1);
// const rotorB = new Rotor(rotor2, 1);

// for(let i= 0; i <= 5; i++) {
//   console.log(i, rotorA.mapping)
//   rotorA.update()
// }

// for(let i= 0; i <= 15; i++) {
//   console.log(i, rotorB.mapping)

//   rotorB.update()
// }

await saveToFile('log.txt')


