import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
// import type FitnessEvaluator from "../fitness/scoreFitness/scoreFitness";
import { log } from "console";
import fs from 'fs';
import path from 'path';

import DutchFitnessEvaluator from "../fitness/dutchFitness/dutchFitness";

// prevent unused import lint
void log;

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


// CSV helpers
const mapToObject = (m: Map<string, any>) => {
    const obj: any = {};
    for (const [k, v] of m) {
        obj[k] = v;
    }
    return obj;
};

const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const writeCSVHeaderIfNeeded = (filePath: string, headers: string[]) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, headers.join(',') + '\n', 'utf8');
    }
};

const escapeForCSV = (val: any) => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return '"' + val.replace(/"/g, '""') + '"';
    return '"' + JSON.stringify(val).replace(/"/g, '""') + '"';
};

const appendResultRow = (filePath: string, record: Record<string, any>) => {
    // ensure timestamp
    if (!record.timestamp) record.timestamp = Date.now();

    // serialize rotor/reflector for easier CSV readability
    if (record.rotor && typeof record.rotor !== 'string') record.rotor = JSON.stringify(record.rotor);
    if (record.reflector && typeof record.reflector !== 'string') record.reflector = JSON.stringify(record.reflector);

    const columns = ['score', 'plain', 'rotor', 'reflector', 'plugBoard', 'cypher', 'timestamp'];
    const values = columns.map(k => escapeForCSV(record[k]));
    fs.appendFileSync(filePath, values.join(',') + '\n', 'utf8');
};


// TODO: write this in a way that the for-loops are dynamically generated!!!
const findSettings = async (_pipeline: Config[], knownSettings: KnownSettings): Promise<Map<string, any>> => {
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

    // initialize results CSV
    const resultsDir = path.join('results/assignment2');
    ensureDir(resultsDir);
    const outFile = path.join(resultsDir, `findSettings-${Date.now()}.csv`);
    console.log('Results CSV:', outFile);
    writeCSVHeaderIfNeeded(outFile, ['score','plain','rotor','reflector','plugBoard','cypher','timestamp']);

    // write initial bestSettings as first line
    appendResultRow(outFile, mapToObject(bestSettings));
    const evaluator = new DutchFitnessEvaluator();
    await evaluator.addReference('src/data/corpus.txt');

    let counter = 0;
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
                let res: string;
                let score: number;
                try {
                    res = await enigmini.decrypt(cypher);
                    score = await evaluator.score(res);
                } catch (err: any) {
                    // If evaluator not initialized with reference data, surface helpful message and rethrow
                    if (err && err.message && err.message.includes('Reference text not found')) {
                        console.error('FitnessEvaluator not initialized. Call evaluator.addReference(pathToReference) before running findSettings.');
                        throw err;
                    }
                    console.warn('Error decrypting/scoring configuration', err);
                    counter++;
                    continue;
                }

                const highScore = bestSettings.get('score');
                
                if(score > highScore) {
                    bestSettings.set('score', score);
                    bestSettings.set('plain', res);
                    
                    const newRotors = [
                        {id: rotor1.id, threshold: rotor1.threshold, value: rotor1setting},
                        {id: rotor2.id, threshold: rotor2.threshold, value: rotor2setting}
                    ]

                    bestSettings.set('rotor', newRotors)
                    bestSettings.set('reflector', reflectorSetting);

                    // append improved result to CSV
                    appendResultRow(outFile, mapToObject(bestSettings));
                    console.log(`${counter} - Better result found! score=${score}`)
                } else {
                    console.log(counter)
                }
                counter++;
                if(highScore >= 1) {
                    return bestSettings;
                }
            }
        }
        
    }

    return bestSettings;
}

export type { Config, KnownSettings };
export { createSettingStore };
export default findSettings;