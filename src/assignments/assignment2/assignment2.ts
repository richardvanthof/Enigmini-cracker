import { keymap } from "../../config";
import type FitnessEvaluator from "../../analysis/fitness/scoreFitness/scoreFirness";
import sequentialSearch from '../../analysis/findSettings/findSettings';
import parralelSearch from "../../analysis/findSettingsParralel/findSettingsParralel";
import type { KnownSettings, Config } from "../../analysis/findSettings/findSettings";
const assignment2 = async (evaluator: FitnessEvaluator, rotors: number[][], reflectors: number[][][]):Promise<any> => {
    
    const plugs = [[1,4],[2,3],[5,6]];
    const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';
    
    /**Selects current search mode
     * Since we're trying to creack an enigma like algorithm, if some settings are correct the plain text already gets more readable.
     * therefore we could 
     * @remarks
     * - `Sequential`: finds best setting per pipeline item -- effecient but a bit less accurate (ca. 1500 variations)
     * - `Parralel`: finds tries all possible settings all at once -- accurate but not at all efficient (ca. 7.776.000 variations!) 
     */
    const mode:'sequencial'|'parralel' = 'sequencial';
    
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
    if(mode === 'sequencial') {
        return await sequentialSearch(pipeline, knownSettings, evaluator, true);
    } else {
        return await parralelSearch(pipeline, knownSettings, evaluator);
    };
}

export default assignment2;