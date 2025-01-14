import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { keymap } from "../../config";
import type FitnessEvaluator from "../../analysis/fitness/scoreFitness/scoreFirness";

const assignment2 = async (evaluator: FitnessEvaluator, rotors: number[][], reflectors: number[][][]):Promise<any> => {
    
    
    type Config = {
        type: 'reflector'|'rotor',
        threshold?: number,
        variations: number[][][]|number[][],
        id?: number
    }

    type KnownSettings = {
        cypher: string,
        plugBoard: number[][],
        keymap: (string|string[])[][]
    }

    type ArraySetting = {
        id: number,
        value: any,
        [key: string]: any
    }

    const findSettings = async (pipeline:Config[],knownSettings:KnownSettings):Promise<Map<string, any>> => {
        
            
        // known settings' is turned into a map for faster performance.
        const bestSettings = new Map<string, any>(Object.keys(knownSettings).map((key) => [key, (knownSettings as any)[key]]))
        
        // add entries for unknown settings
        bestSettings.set('score', 0).set('plain', '').set('rotors', []);
        
        // find best configuration for each unknown setting
        pipeline.forEach((unknownSetting:Config, idx: number) => {

            const {type, threshold, variations} = unknownSetting;
            
            // if we're looking for a rotor, add new rotor placeholder to bestSettings
            if(type === 'rotor') {
                let current:ArraySetting[] = bestSettings.get('rotors');
                current.push({id: idx, value: [], threshold});
                bestSettings.set('rotors', current);
            };

            // run the decyyption algorithm for each setting variation.
            variations.forEach(async (variation: number[][]|number[]) => {
                
                let rotors: ArraySetting[] = [];
                
                // Create rotor configuration based on known rotors and new variation.
                if(type === 'rotor') {
                   
                    // get all current rotors (minus the last one) + the current variation
                    const knownRotors:ArraySetting[] = bestSettings.get('rotors').slice(0, -1);
                    rotors = [...knownRotors, {id: idx, value: variation, threshold}]
                } else {
                    rotors = bestSettings.get('rotors')
                }

                // configure enigmini with current settings
                const rotorConfig = rotors.map(({threshold, value}) => new Rotor(value, threshold));
                const reflector = (type === 'reflector') ? variation : bestSettings.get('reflector');
                const enigmini = new Enigmini(bestSettings.get('keymap'), rotorConfig, reflector || undefined, bestSettings.get('plugBoard'))
                
                // test current configuraton
                const cypher = bestSettings.get('cypher')
                const res = await enigmini.decrypt(cypher)
                const score = await evaluator.score(res);  // score variations on the chance that it is language

                if(score > bestSettings.get('score')) {
                    bestSettings
                    .set('score', score) // add highscore to bestsettings
                    .set('plain', res) // add best config for current elem to bestsettings
                    
                    const setting = bestSettings.get(type)
                    if(Array.isArray(setting)) {

                    } else {
                        bestSettings
                    }
                }
            });
        });
    

        return bestSettings;
        
    }
    
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
        keymap,
    }

    return await findSettings(pipeline, knownSettings);



}

export default assignment2;