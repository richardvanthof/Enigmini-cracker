import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import type FitnessEvaluator from "../fitness/scoreFitness/scoreFirness";
import { reflector as sampleReflector, operations as sampleOperations} from "../../config";
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

const tempStandardRotor = [0,0,0,0,0,0];

const createSettingStore = (knownSettings: KnownSettings):Map<string, any> => {
    // known settings' is turned into a map for faster performance.
    const store = new Map<string, any>(Object.keys(knownSettings).map((key) => [key, (knownSettings as any)[key]]));
        
    // add entries for unknown settings
    return store.set('score', 0).set('plain', '').set('rotor', []).set('reflector', []);
};

const findSettings = async (_pipeline: Config[], knownSettings: KnownSettings, evaluator:FitnessEvaluator ): Promise<Map<string, any>> => {
    let bestSettings:Map<string, any> = createSettingStore(knownSettings);
    let rotorPlaceholders:VariationConfig[] = [];
    const pipeline:Config[] = _pipeline.map((item, index) => {

        // make sure that unknown rotors contain a placeholder using a random config to ensure consistent functioning of the algorithm.
        
        if(item.type === 'rotor') {
            rotorPlaceholders.push({id: index, value: tempStandardRotor, threshold: item.threshold})
            bestSettings.set('rotor', rotorPlaceholders);
        }
        return {
            ...item,
            id: index
        }
    })

    // Loop through each unknown setting
    for(let idx = 0; idx < pipeline.length; idx++) {
        // unknown setting data
        const {type, threshold, variations, id}:Config = pipeline[idx];

        const rotorconfig = bestSettings.get('rotor')
        //console.log(bestSettings, rotorconfig.forEach(({id, value}) => console.log({id, value: JSON.stringify(value)})));
        for(const variation of variations) {

            // if type == rotors: crea
            let rotorsConfigs:VariationConfig[] = bestSettings.get('rotor');
            if(type === 'rotor') {
                // find the slot for the current rotor and change the configuration to the current variant,
                const index = rotorsConfigs.findIndex(rotor => rotor.id === id)
                const current = rotorsConfigs[index];
                rotorsConfigs[index] = {
                    ...current,
                    value: variation
                }
            }

            // Configure Enigmini with current settings
            // const rotorConfig: Rotor[] = rotors.map(({ threshold, value }) => new Rotor(value as number[], threshold as number));
            const rotors: Rotor[] = rotorsConfigs.map((r) => {
                if(!r.threshold || !r.value) {throw new Error('rotor operations and threshold are not defined.')}
                return new Rotor(r.value, r.threshold)
            });

            // console.log(rotorConfig)

            // TODO: check if rotor configs are properly added to new Rotor instances.

            // await saveToFile('logs/rotorConfigs.txt', JSON.stringify(rotorConfig), 'append'); 
            let reflector:number[][] = [];
            if(type === 'reflector') {
                reflector = variation as number[][];
            } else {
                const current = bestSettings.get('reflector');
                if(current.length > 0 && current) {
                    reflector = current
                } else {
                    reflector = sampleReflector
                }
            }

            const enigmini = new Enigmini(bestSettings.get('keyMap'), rotors, reflector, bestSettings.get('plugBoard'));

            // Test current configuration
            const cypher = bestSettings.get('cypher'); //cypher gets read.
                
            const res = await enigmini.decrypt(cypher);
            const score = await evaluator.score(res);  // Score variations on the chance that it is language
            console.log(res, score, variation, type);
            // if current score is better than highscore: save the config!
            const highScore = bestSettings.get('score');
            // console.log(res, score);
            if(score > highScore) {
                bestSettings.set('score', score);
                bestSettings.set('plain', res);

                let current = bestSettings.get(type);
                if(Array.isArray(current) && type === 'rotor') {
                    const settingIndex = current.findIndex((item) => item.id === id);
                    if(settingIndex !== -1 || !settingIndex) {
                        current[settingIndex]['value'] = variation
                    } else {
                        current.push({id, value: variation, threshold})
                    }
                } else {
                    bestSettings.set(type, variation);
                }
                /// await saveToFile('/logs/allcurrent.txt', JSON.stringify(current), 'append');
                
            }
            // const newRotors = bestSettings.get('rotor');
            // await saveToFile('logs/rotorconfigs.txt', JSON.stringify(newRotors), 'append')
        }
    }

    return bestSettings;
}

export default findSettings;
export {createSettingStore, KnownSettings, Config}