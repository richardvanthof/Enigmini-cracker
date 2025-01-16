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
};

const generateRotorVariations = async (input: number[], output: number[] = input): Promise<number[][]> => {
    try {
        // Make sure input and output array are of equal length
        if (input.length !== output.length) { throw new Error('input and output array must be of same length.') }
    
        const configs = await permuteConfigs(input, output);
        let operations:number[][] = [];
        configs.forEach(config => {
            let result:number[] = [];
            config.forEach((output, input) => result.push(output - input));
            operations.push(result);
        });
        return operations;

    } catch (err) {
        throw err;
    }
};

export default generateRotorVariations;
export {permuteConfigs};