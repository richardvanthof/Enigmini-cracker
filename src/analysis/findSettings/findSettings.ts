import saveToFile from "../../lib/Logger"
import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import type FitnessEvaluator from "../fitness/scoreFitness/scoreFirness";
import { reflector as sampleReflector} from "../../config";
type Config = {
    type: 'reflector'|'rotor',
    threshold?: number,
    variations: number[][][]|number[][],
    id?: number
}

type KnownSettings = {
    cypher: string,
    plugBoard: number[][],
    keyMap: (string|string[])[][]
}

type VariationConfig = {
    id: number,
    value: any,
    threshold?: number
}

const createSettingStore = (knownSettings: KnownSettings):Map<string, any> => {
    // known settings' is turned into a map for faster performance.
    const store = new Map<string, any>(Object.keys(knownSettings).map((key) => [key, (knownSettings as any)[key]]));
        
    // add entries for unknown settings
    return store.set('score', 0).set('plain', '').set('rotor', []);
};

const findSettings = async (pipeline: Config[], knownSettings: KnownSettings, evaluator:FitnessEvaluator ): Promise<Map<string, any>> => {
    let bestSettings:Map<string, any> = createSettingStore(knownSettings);

    // Loop through each unknown setting
    for(let id = 0; id < pipeline.length; id++) {
        // current unknown setting data
        const {type, threshold, variations}:Config = pipeline[id];
        
        for(const variation of variations) {
            // await saveToFile('logs/all-stages.txt', `${id} - ${variation} - ${type}`, 'append');
            // if type == rotors: crea
            let rotors:VariationConfig[] = [];
            if(type === 'rotor') {
                rotors = [...bestSettings.get('rotor'), {id, value: variation, threshold}]
            } else {
                rotors = [...bestSettings.get('rotor')];
            }

            // Configure Enigmini with current settings
            // const rotorConfig: Rotor[] = rotors.map(({ threshold, value }) => new Rotor(value as number[], threshold as number));
            const rotorConfig: Rotor[] = rotors.map((r) => {
                if(!r.threshold || !r.value) {throw new Error('rotor operations and threshold are not defined.')}
                return new Rotor(r.value, r.threshold)
            });

            // console.log(rotorConfig)

            // TODO: check if rotor configs are properly added to new Rotor instances.

            // await saveToFile('logs/rotorConfigs.txt', JSON.stringify(rotorConfig), 'append'); 
            const reflector = (type === 'reflector') ? variation : bestSettings.get('reflector') || sampleReflector;
            const enigmini = new Enigmini(
                bestSettings.get('keyMap'), 
                rotorConfig, reflector || undefined, 
                bestSettings.get('plugBoard')
            );

            // Test current configuration
            const cypher = bestSettings.get('cypher'); //cypher gets read.
                
            const res = await enigmini.decrypt(cypher);
            const score = await evaluator.score(res);  // Score variations on the chance that it is language

            // console.log(res, score);
            // if current score is better than highscore: save the config!
            if(score > bestSettings.get('score')) {
                let current = bestSettings.get(type);
                if(Array.isArray(current)) {
                    const settingIndex = current.findIndex((item) => item.id === id);
                    if(settingIndex !== -1 || !settingIndex) {
                        current[settingIndex]['value'] = variation
                    } else {
                        current.push({id, value: variation, threshold})
                    }
                } else {
                    current = variation
                }
                /// await saveToFile('/logs/allcurrent.txt', JSON.stringify(current), 'append');
                bestSettings.set(type, current);
            }
            // const newRotors = bestSettings.get('rotor');
            // await saveToFile('logs/rotorconfigs.txt', JSON.stringify(newRotors), 'append')
        }
    }

    return bestSettings;
}

export default findSettings;
export {createSettingStore, KnownSettings, Config}