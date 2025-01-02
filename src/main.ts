import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';
import {saveToFile, markDiffs} from './lib/Logger';

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
  [
      [1, 2, 1],
      [2, 5, 3],
      [3, 4, 1],
      [4, 6, 2],
      [5, 1, 2],
      [6, 3, 3]
  ],
  [
      [1, 4, 3],
      [2, 3, 1],
      [3, 6, 3],
      [4, 5, 1],
      [5, 1, 2],
      [6, 2, 2]
  ],
  [
      [1, 3, 2],
      [2, 5, 3],
      [3, 4, 1],
      [4, 1, 3],
      [5, 6, 1],
      [6, 2, 2]
  ],
  [
      [1, 3, 2],
      [2, 4, 2],
      [3, 6, 3],
      [4, 5, 1],
      [5, 2, 3],
      [6, 1, 1]
  ],
  [
      [1, 2, 1],
      [2, 4, 2],
      [3, 5, 2],
      [4, 1, 3],
      [5, 6, 1],
      [6, 3, 3]
  ],
  [
      [1, 4, 3],
      [2, 3, 1],
      [3, 5, 2],
      [4, 6, 2],
      [5, 2, 3],
      [6, 1, 1]
  ],
];

const rotor2 = [
  [
    [1, 3, 2],
    [2, 1, -1],
    [3, 5, 2],
    [4, 6, 2],
    [5, 2, 3],
    [6, 4, -2]
  ],
  [
    [1, 5, -2],
    [2, 4, 2],
    [3, 2, -1],
    [4, 6, 2],
    [5, 1, 2],
    [6, 3, 3]
  ],
  [
    [1, 4, 3],
    [2, 6, -2],
    [3, 5, 2],
    [4, 3, -1],
    [5, 1, 2],
    [6, 2, 2]
  ],
  [
    [1, 3, 2],
    [2, 4, 2],
    [3, 6, 3],
    [4, 6, 2],
    [5, 4, -1],
    [6, 2, 2]
  ],
  [
    [1, 3, 2],
    [2, 4, 2],
    [3, 6, 3],
    [4, 2, -2],
    [5, 1, 2],
    [6, 5, -1]
  ],
  [
    [1, 6, -1],
    [2, 4, 2],
    [3, 5, 2],
    [4, 1, 3],
    [5, 3, -2],
    [6, 2, 2]
  ]
];

// Reference string
const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const cypher = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";

const rotorConfig = [new Rotor(rotor1[0], 1), new Rotor(rotor2[0], 6)];
const rotorConfig2 = [new Rotor(rotor1[0], 1), new Rotor(rotor2[0], 6)];

const enigmini = new Enigmini(keymap, rotorConfig, reflector);
const enigmini2 = new Enigmini(keymap, rotorConfig2, reflector);

const encryption = markDiffs(enigmini.encypher(plain, true), cypher);
const decrpytion = markDiffs(enigmini2.encypher(cypher), plain);

console.log(`
# Enigmini results
0. prove that encryption algorithm works

Encrypt:
REF: ${encryption.ref} 
RES: ${encryption.diff}
Differences: ${encryption.count} (${encryption.count/cypher.length*100}%)

Decrypt:
REF: ${decrpytion.ref}
RES: ${decrpytion.diff}
Differences: ${decrpytion.count} (${decrpytion.count/plain.length*100}%)
`);

await saveToFile('log.txt')


