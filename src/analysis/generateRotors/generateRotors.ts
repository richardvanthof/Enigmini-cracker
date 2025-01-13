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

const calculateSteps = (config: Map<number, number>) => {
    const mutations:Map<number,number> = new Map([])
    const totalPositions = 6;
    console.log(totalPositions);
    
    config.forEach((to, from) => {
    
        // Direct distance
        let directDistance = to - from;
    
        // Wrap-around distance
        let wrapAroundDistance = totalPositions - Math.abs(directDistance);
        if(directDistance > 0) {
            // direct: clockwise -- wrap around counter clockwise
            wrapAroundDistance *= -1;
    
        }
        // console.log({from,to, wrapAroundDistance, directDistance, totalPositions})
        mutations.set(directDistance, wrapAroundDistance)
    });
    return mutations;
}

const generateMutations = async (input: number[], configs: Map<number, number>[]):Promise<number[][]> => {
    const mutationPossibilities = configs.map(config => calculateSteps(config));
    // for each config: 
    const configurations = mutationPossibilities.flatMap((config, index) => {
        return config.map((possibilities, index) => {
            let combinations = [];
            // get the total number of possibilities
            const totalPossibilities = 2^possibilities.size;
            // for loop through each number, convert current index to binary
            let current = new Map();
            let counter = 0;
            for(let c = 1; c <= totalPossibilities; c++) {
                const binary = c.toString(2).padStart(possibilities.size, '0').split('');

                binary.forEach((bit, idx) => {
                    const [direct, wrap] = Array.from((possibilities as Map<number, number>).entries())[idx];
                    current.set(direct, bit === '0' ? direct : wrap);
                });
                	
                if(c % possibilities.size) {
                    combinations.push(current);
                    current = new Map();
                    counter = 0;
                } else {
                    counter++
                }
            };
            // split binary into array
                // each 0 becomes option 0, 1 option 1
            // each 6th loop we will create a new map
        })
    });
    
} 

const generateRotorVariations = async (input: number[], output: number[] = input): Promise<[number, number][][]> => {
    try {
        // Make sure input and output array are of equal length
        if (input.length !== output.length) { throw new Error('input and output array must be of same length.') }
    
        const configs = await permuteConfigs(input, output);
        const mutations = await generateMutations(input, configs);
    } catch (err) {
        throw err;
    }
}

export {permuteConfigs, calculateSteps, generateMutations};
export default generateRotorVariations;