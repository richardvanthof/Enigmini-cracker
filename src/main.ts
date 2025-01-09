import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';
import generatePlugCombinations from './analysis/generatepPlugboards/generatePlugboards.js';
import {logToCSV, markDiffs} from './lib/Logger';
import calculateIOC, {countFrequencies} from './analysis/fitness/calculateIOC/calculateIOC';
import { scoreString } from './analysis/fitness/calculateNGram/calculateNGrams';
import { keymap, reflector, operations } from './config';

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
  const input = 'UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116.';
  const plugboards = await generatePlugCombinations([1,2,3,4,5,6])
  const results:Map<string, unknown>[] = [];
  console.info('Generating nGram models. One moment please...')
  for (const plugs of plugboards) {
    const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];
    const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugs);
    const res = await enigmini.decrypt(input);
    

    const quad = await scoreString(res, 'quad');
    const tri = await scoreString(res, 'tri');
    const bi = await scoreString(res, 'bi');

    results.push(new Map([
      ['plain', res],
      ['IoC', calculateIOC(res)],
      ['quadgram', quad],
      ['trigram', tri],
      ['bigram', bi],
      ['config', JSON.stringify(plugs)]
    ]));
  }
  const file = `results/assignment1/assignment1-${new Date().getTime()}.csv`;
  await logToCSV(results, file);
  return {
    map: JSON.stringify([[1,4],[2,3],[5,6]]),
    result: 'IK KEN GEEN ANDERE LANDEN, ZELFS AL BEN IK ER GEWEEST.N',
    answer: 'Liefs uit London'
  }
} catch(err) {
    console.error(err)
  }
}

console.log({assignment1: await assignment1()});


const assignment2 = async () => {
  const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';
  const plugboard = [[1,4],[2,3],[5,6]];


  //

  const rotorConfig = [new Rotor(operations.rotor1, 6)];
  const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugboard);

  
  const plugboards = await generatePlugCombinations([1,2,3,4,5,6], true);
  // const reflectorResults = plugboards.map(async (plugboard) => {

  //   const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];
  //   const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugs);
  //   const res = await enigmini.decrypt(input);
    
  //   const quad = await scoreString(res, 'quad');

      
  // });
  
  /**
   * all rotor combinations:
   * 6!*(6!-1) = 517.680 permutations
   * 
   * reflector + all rotors
   * 517.680 * 15 = 7.765200 permutations
   *
   * # Possible combinations   
   * reflector
   * (6!)/(2^3*3!) = 15 combinations
   * 
   * rotor1
   * 6! = 720 permutations
   * 
   * rotor2
   * 6! - 1 = 719 permutations
   * 
   * # Approach
   * 1. rotor 1: generate decryptions using all possible rotor 1 possibilities. 
   * keep the rest as default.
   * 2. check which outputs look the like dutch. cut off list by certain threshold (top 150?)
   *    a. Index of coincedence
   *        - count occurence of every character, 
   *        - produce historgram, 
   *        - calculate IOC
   *    evenly distributed:   0.038
   *    language-like:        0.067 
   *    b. bigram/trigram/quadgram
   * 3. rotor 2: generate decryptions 
   * 4. check which outputs look the most like Dutch
   * 5. generate all versions of all reflectors
   */

  console.log(plugboards);
  return {
    result: await enigmini.decrypt(input)
  }
}

console.log({assignment2: await assignment2()});
