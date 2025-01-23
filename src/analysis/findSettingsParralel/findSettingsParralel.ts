import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import type FitnessEvaluator from "../fitness/scoreFitness/scoreFitness";
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


// TODO: write this in a way that the for-loops are dynamically generated!!!
const findSettings = async (_pipeline: Config[], knownSettings: KnownSettings, evaluator:FitnessEvaluator): Promise<Map<string, any>> => {
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

    for(const rotor1setting of pipeline[0].variations) {
        const rotor1 = pipeline[0];
        for(const rotor2setting of pipeline[1].variations) {
            const rotor2 = pipeline[1]
            for (const reflectorSetting of pipeline[2].variations) {
                const rotorConfig = [
                    new Rotor(rotor1setting as number[], rotor1.threshold), 
                    new Rotor(rotor2setting as number[], rotor2.threshold)
                ];
                const enigmini = new Enigmini(
                    bestSettings.get('keyMap'), 
                    rotorConfig, 
                    reflectorSetting as number[][], 
                    bestSettings.get('plugBoard')
                );

                // Test current configuration
                const cypher = bestSettings.get('cypher'); //cypher gets read.
                    
                const res = await enigmini.decrypt(cypher);
                const score = await evaluator.score(res);  // Score variations on the chance that it is language
                // console.log(res, score, variation, type);
                // if current score is better than highscore: save the config!
                const highScore = bestSettings.get('score');
                // console.log(res, score);
                if(score > highScore) {
                    bestSettings.set('score', score);
                    bestSettings.set('plain', res);
                    
                    const newRotors = [
                        {id: rotor1.id, threshold: rotor1.threshold, value: rotor1setting},
                        {id: rotor2.id, threshold: rotor2.threshold, value: rotor2setting}
                    ]

                    bestSettings.set('rotor', newRotors)
                    bestSettings.set('reflector', reflectorSetting);

                    /// await saveToFile('/logs/allcurrent.txt', JSON.stringify(current), 'append');
                    
                };

            }
        }
    };

    return bestSettings;
}

export default findSettings;
export {createSettingStore, KnownSettings, Config}