/**Generate all possible rotor configurations */
const permuteConfigs = async (input: number[], output: number[]): Promise<Map<number, number>[]> => {

    const createRotorConfig = (input: number[], output: number[]): Map<number, number> => {
        const config: readonly [number, number][] = output.map((outVal, index) => [input[index], outVal]);
        return new Map(config);
    };

    const permute = (arr: number[]): number[][] => {
        if (arr.length === 0) return [[]];
        const result: number[][] = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
            for (const perm of rest) {
                result.push([arr[i]].concat(perm));
            }
        }
        return result;
    };

    const outputPermutations = permute(output);
    return outputPermutations.map(permutation => createRotorConfig(input, permutation));
}

/**
 * Calculate how many steps it takes (clockwise or counter clockwise) to go from one rotor position to another.
 * 
 * @param config 
 * @returns 
 * A map with the short amount of steps (direct distance) or the long amount of steps 
 * (wrap around distance; since a value has to wrap from the front to the back of the list (or reverse) for this route.)
 */
const calculateSteps = (config: Map<number, number>):number[][] => {
    const mutations: number[][] = [];
    const totalPositions = 6;

    config.forEach((to, from) => {
        // Direct distance
        let directDistance = to - from;

        // Wrap-around distance
        let wrapAroundDistance = totalPositions - Math.abs(directDistance);
        if (directDistance > 0) {
            // direct: clockwise -- wrap around counter clockwise
            wrapAroundDistance *= -1;
        }
        // exclude entry if the distance equals the config length since this is just a wraparound.
        mutations.push([directDistance, wrapAroundDistance]);
    });
    
    // Remove all combinations that contain a mutation that equals the length of the config,
    // since this is just a roundtrip.
    return mutations
};

/**
 * The next rotor position of the Enigmini is given as a mutation 
 * (amount of steps forward/backward). 
 * You can go to the next position via two routes (the long or the short route).
 * this function generates all possible combinations of the short and the long route 
 * for each possible rotor configuration.
 * */
const generateMutations = async (mutationPossibilities:number[][][]):Promise<number[][]> => {

    // map through all possible mutation possibilities for each pair within a rotor config
    return mutationPossibilities.flatMap((rotor:number[][]) => {
        let combinations:number[][] = [];
        
        const totalPossibilities = 2 ** rotor.length;
        // for loop through each number, convert current index to binary
        let current:number[] = []

        // we're using binary numbers to decide the placement of the different routes 
        // in a combination since this is easier to calculate.
        for(let c = 1; c < totalPossibilities; c++) {
            const binary = c.toString(2).padStart(rotor.length, '0').split('');

            current = [];
            binary.forEach((bit, idx) => {
                const entry = rotor[idx];
                if (entry) {
                    const [direct, wrap] = entry;
                    current.push(bit === '0' ? direct : wrap);
                }
            });
            combinations.push(current);
            
        };

        return combinations;
    });
    
} 

/**Generate all possible rotor configurations
 * @remark
 * this is being done in the form of a list of 'mutations': a list that tells the enigmini how many steps forward/backwards to take from a certain rotor position.
 * this enables the algorithm to generate all the possible rotor position for a certain configuration.
 * @public
 */
const generateRotorVariations = async (input: number[], output: number[] = input): Promise<number[][]> => {
    try {
        // Make sure input and output array are of equal length
        if (input.length !== output.length) { throw new Error('input and output array must be of same length.') }
    
        const configs = await permuteConfigs(input, output);
        const mutationPossibilities = configs.map((config) => {

            // get all operations.
            const operations:number[][] = calculateSteps(config)

            // make sure that none of the values in a rotor config are the length of the rotor config since 
            // this would just equal a movement of 0.
            return operations.filter(rotor => rotor.some(val => Math.abs(val) !== input.length))
        });
        return await generateMutations(mutationPossibilities);

    } catch (err) {
        throw err;
    }
}

export {permuteConfigs, calculateSteps, generateMutations};
export default generateRotorVariations;