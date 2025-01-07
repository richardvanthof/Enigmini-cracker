import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';
import generatePlugCombinations from './analysis/generatepPlugboards/generatePlugboards.js';
import {logToCSV, markDiffs} from './lib/Logger';

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

console.log('Initiating...')

const assignment0 = async () => {
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
};

await assignment0();

const assignment1 = async () => {
  try {
  console.log('generating plugboard combinations');
  const input = 'UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116.';
  const plugboards = await generatePlugCombinations([1,2,3,4,5,6])
  const results:Map<string, unknown>[] = [];
  for (const plugs of plugboards) {
    const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];
    const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugs);
    const res = await enigmini.decrypt(input);
    results.push(new Map([
      ['plain', res],
      ['config', JSON.stringify(plugs)]
      // ['bigram', analysis.bigram],
      // ['trigram', analysis.trigram],
      // ['quadgram', analysis.quadgram]
    ]));
  }
  const file = `results/assignment1/assignment1-${new Date().getTime()}.csv`;
  await logToCSV(results, file);
  return `> Results saved to ${file}` 
} catch(err) {
    console.error(err)
  }
}

console.log(await assignment1());
console.log({
  map: [[1,4],[2,3],[5,6]],
  result: 'IK KEN GEEN ANDERE LANDEN, ZELFS AL BEN IK ER GEWEEST.N',
  answer: 'Liefs uit London'
})
