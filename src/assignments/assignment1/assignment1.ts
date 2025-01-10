import { logToCSV } from "../../lib/Logger";
import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { reflector, operations, keymap } from "../../config";
import generatePlugCombinations from "../../analysis/generatepPlugboards/generatePlugboards";
import score from "../../analysis/fitness/scoreFitness/scoreFirness";

const assignment1 = async () => {
    try {
    const input = 'UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116.';
    const plugboards = await generatePlugCombinations([1,2,3,4,5,6])
    const results:Map<string, unknown>[] = [];
    
    let bestConfig:Map<string, any> = new Map();
    for (const plugs of plugboards) {
      const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];
      const enigmini = new Enigmini(keymap, rotorConfig, reflector, plugs);
      const res = await enigmini.decrypt(input);
      
      const fitness = await score(res);

      if(fitness > bestConfig.get('score') || !bestConfig.get('score')) {
        bestConfig = new Map([
            ['plain', res],
            ['score', fitness.toString()],
            ['plugboard', JSON.stringify(plugs)]
        ])
      }
  
      results.push(new Map([
        ['plain', res],
        ['score', fitness.toString()],
        ['plugboard', JSON.stringify(plugs)]
      ]));
    }
    const file = `results/assignment1/assignment1-${new Date().getTime()}.csv`;
    results.sort((a, b) => (b.get('score') as number) - (a.get('score') as number));
    await logToCSV(results, file);
    return bestConfig;
  } catch(err) {
      console.error(err)
    }
  }

  export default assignment1;