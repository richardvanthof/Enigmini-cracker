import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { keymap } from "../../config";
import type FitnessEvaluator from "../../analysis/fitness/scoreFitness/scoreFirness";






const assignment2 = async (evaluator: FitnessEvaluator, rotors: number[][][], reflectors: number[][][]):Promise<number> => {
    type RotorVariations = {
        type: 'rotor',
        allSettings: number[][],
        threshold: number = 1
    };
    
    type ReflectorVariations = {
        type: 'reflector',
        allSettings: number[][][]
    }

    

    const findSetting = (cypher:string, variations:RotorVariations|ReflectorVariations,) => {

        let highScore = 0
        variations.forEach(variation => {
            const rotorConfig = [new Rotor(operations.rotor1, 6)];
            const enigmini = new Enigmini(keymap, rotorConfig, reflector,);
            const result = await enigmini.decrypt(cypher);
            const score = await evaluator.score(result);

            if(score > highScore) {
                highScore = score;
                // add output and curent setting to current config.
            }

            rotorConfig = [], enigmini = null
        })

        
    }
    
    const plugs = [[1,4],[2,3],[5,6]];
    const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';
    const knownSettings:Map<string, unknown|unknown[][]> = new Map([
        ['keymap',keymap],
        ['plugboard', plugs],
        ['cypher', input]
    ])

    

    return 
}

export default assignment2;