/**Calculate how many tiess a word occurs. */
const countFrequencies = (text: string):Map<string, number> => {
    // Count frequency of each character using Map
    const frequencies = new Map<string, number>();
    for (const char of text) {
        frequencies.set(char, (frequencies.get(char) || 0) + 1);
    }
    return frequencies;
}

/**
 * Calculate Index of coincedence 
 * */
function calculateIOC(text: string): number {
    const n = text.length;
    if (n <= 1) throw new Error('Input string is empty.')

    const frequencies = countFrequencies(text);

    // Calculate sum of frequencies
    let sum = 0;
    for (const frequency of frequencies.values()) {
        sum += frequency * (frequency - 1);
    }

    // Calculate IOC: sum(fi(fi-1)) / (N(N-1))
    return sum / (n * (n - 1));
}

export {countFrequencies};
export default calculateIOC