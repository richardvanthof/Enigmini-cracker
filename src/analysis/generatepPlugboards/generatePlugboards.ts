// Function to generate all combinations of swaps for the plugboard
async function generatePlugCombinations(numbers: number[]): number[][][] {
    if(numbers.length % 2 !== 0) { throw new Error('Options have to be an even amount.')}
    let results: number[][][] = [];
  
    // Helper function to generate all pairs of numbers
    function getPairs(arr: number[]): number[][] {
      let pairs: number[][] = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          pairs.push([arr[i], arr[j]]);
        }
      }
      return pairs;
    }
  
    // Helper function to generate all valid combinations of pairs
    function getCombinations(pairs: number[][], start: number = 0, current: number[][] = []): void {
      // Add the current combination to results
      results.push([...current]);
  
      // Add new pairs to the current combination and recurse
      for (let i = start; i < pairs.length; i++) {
        let pair = pairs[i];
        // Check if any number from this pair is already in use in the current combination
        let inUse = current.some(comb => comb.includes(pair[0]) || comb.includes(pair[1]));
  
        if (!inUse) {
          // If not in use, add it to the combination and continue
          getCombinations(pairs, i + 1, [...current, pair]);
        }
      }
    }
  
    // Generate all possible pairs
    const pairs: number[][] = getPairs(numbers);
  
    // Generate all valid combinations of pairs (from 0 pairs to 3 pairs)
    getCombinations(pairs);
    console.log(results);
    return results;
}


export default generatePlugCombinations;
  