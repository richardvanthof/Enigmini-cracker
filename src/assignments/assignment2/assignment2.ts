import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { keymap } from "../../config";
import type FitnessEvaluator from "../../analysis/fitness/scoreFitness/scoreFirness";

const assignment2 = async (evaluator: FitnessEvaluator, rotors: number[][], reflectors: number[][][]):Promise<any> => {
    
    
    type Config = {
        type: 'reflector'|'rotor',
        threshold?: number,
        variations: number[][][],
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

    const findSettings = async (pipeline:Config[],knownSettings:KnownSettings) => {
        /**turn known settings into a map (faster performance) and add extra settings*/
        const settings = new Map<string, any>(Object.keys(knownSettings).map((key) => [key, (knownSettings as any)[key]]))
        settings.set('score', 0).set('plain', '').set('rotors', []);
        console.log(settings);

        // give each pipeline step an id;
        const steps:ArraySetting[] = pipeline.map((step, index) => ({ ...step, id: index }))
        
        const findSetting = async (pipeline: Config[], knownSettings: Map<string, any>):Promise<Map<string, any>> => {
            
            // best settings found in this step
            let bestSettings = knownSettings; 
            const currentRotors = bestSettings.get('rotors');
            const {type, threshold, variations, id} = steps[0];

            if(type === 'rotor') {
                // add new rotor placeholder to bestSettings
                let current:ArraySetting = bestSettings.get('rotors');
                current.push({id, value: [], threshold})
            }

            if (variations) {
                variations.forEach(async (variation: number[][]) => {
                    // get all current rotors (minus the last one) + the current variation
                    const rotors:ArraySetting[] = (type === 'rotor') ? [...currentRotors.pop(), {id, value: variation, threshold}] : bestSettings.get('rotors');
                    // todo: how should rotors be implemented?

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
                    }
                });
            } else {
                console.error('Variations are undefined for step:', steps[0]);
            }
            
            // recusively call findsetting 
            // - add the currest bestSettings as 'known settings
            // - add the remainder of the pipeline to the findsettings function
            const theRest = pipeline.slice(1);
            bestSettings = await findSetting(theRest, bestSettings)
            // return bestsettings map0 when done
            return bestSettings
        }

        return await findSetting(pipeline, settings)
        
    }
    
    const plugs = [[1,4],[2,3],[5,6]];
    const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';
    
    const pipeline:Config[] = [
        {type: 'rotor', threshold: 1, variations: [rotors]},
        {type: 'rotor', threshold: 6, variations: [rotors]},
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