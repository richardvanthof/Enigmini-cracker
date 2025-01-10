import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { reflector, operations, keymap } from "../../config";

const assignment2 = async () => {
const input = '0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2';

let optimalSettings = new Map([
    ['rotorConfig', []],
    ['reflector', null],
])

const rotorConfig = [new Rotor(operations.rotor1, 6)];
const enigmini = new Enigmini(keymap, rotorConfig, reflector, [[1,4],[2,3],[5,6]]);

/**
 * Generates all permutations of an array.
 * @param array - The array to permute.
 * @returns An array of permutations.
 */
function generatePermutations<T>(array: T[]): T[][] {
    if (array.length === 0) return [[]];

    const permutations: T[][] = [];
    for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = array.slice(0, i).concat(array.slice(i + 1));
    const subPermutations = generatePermutations(remaining);
    for (const perm of subPermutations) {
        permutations.push([current, ...perm]);
    }
    }

    return permutations;
}

    /**
     * Generates all possible arrays of pairs by permuting the second column.
     * @returns An array of arrays of pairs.
     */
    function generatePairings(): [number, number][][] {
    const firstColumn = [1, 2, 3, 4, 5, 6];
    const secondColumn = [1, 2, 3, 4, 5, 6];

    const permutations = generatePermutations(secondColumn);
    const pairings: [number, number][][] = permutations.map(permutation =>
        firstColumn.map((value, index) => [value, permutation[index]] as [number, number])
    );

    return pairings;
}



const findRotorSettings = (currentSettings: Map<string, any>, threshold: number):number[] => {
    const combinations: [number, number][][] = generatePairings();
    
    const operations:number[][] = []; 
    
    combinations.forEach(setting => {
    operations.push(setting.map(([input, output]) => output - input))
    operations.push(setting.map(([input, output]) => input - output))
    });
    console.log(operations);

    // let highScore = 0;
    // let bestConfig = null;
    
    // const knownRotors = settings.get(rotorConfig);
    // operations.forEach(rotorSetting => {
    //   const rotorConfig = [...knownRotors, new Rotor(rotorSetting, threshold)]
    //   con
    //   const enigmini = new Enigmini(keymap, )
    // })
};



// const plugboardCombinations = await generatePlugCombinations([1,2,3,4,5,6], true);

findRotorSettings(optimalSettings, 1);

// find rotor 1
// find rotor 2
// find reflector

    return {
        result: await enigmini.decrypt(input)
    }
}

export default assignment2;