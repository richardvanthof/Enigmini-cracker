import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';
import {saveToFile, markDiffs} from './lib/Logger';

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

const operations = {
  rotor1: [1, 3, 1, 2, 2, 3],
  rotor2: [2, -1, 2, 2, 3, -2]
}

// Reference string
const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const cypher = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";

const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];

const rotorA = new Rotor(operations.rotor1, 1);
const rotorB = new Rotor(operations.rotor2, 6);

const enigmini = new Enigmini(keymap, rotorConfig, reflector);
const enigmini2 = new Enigmini(keymap, [rotorA, rotorB], reflector);

const encryption = markDiffs(await enigmini.encrypt(plain), cypher);
const decrpytion = markDiffs(await enigmini2.decrypt(cypher), plain);


const assignment1 = async () => {
  const enigmini = new Enigmini(keymap, rotorConfig, reflector);
  return await enigmini.decrypt('UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116.');
}
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

1. Gegeven is dezelfde beginconfiguratie als in het voorbeeld, maar met een ander stekkerbord.
Geef de titel voor 'UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116.'
${await assignment1()}
`);

await saveToFile('log.txt')


