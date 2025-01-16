import { keymap } from "../../config";
import type FitnessEvaluator from "../../analysis/fitness/scoreFitness/scoreFirness";
import findSettings from '../../analysis/findSettingsParralel/findSettingsParralel';
import type { KnownSettings, Config } from "../../analysis/findSettings/findSettings";
const assignment2 = async (evaluator: FitnessEvaluator, rotors: number[][], reflectors: number[][][]):Promise<any> => {
    
    const plugs = [[1,4],[2,3],[5,6]];
    const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';
    
    const pipeline:Config[] = [
        {type: 'rotor', threshold: 1, variations: rotors},
        {type: 'rotor', threshold: 6, variations: rotors},
        {type: 'reflector', variations: reflectors}
    ]

    const knownSettings:KnownSettings = {
        cypher: input,
        plugBoard: plugs,
        keyMap: keymap,
    };

    return await findSettings(pipeline, knownSettings, evaluator, true);

}

export default assignment2;