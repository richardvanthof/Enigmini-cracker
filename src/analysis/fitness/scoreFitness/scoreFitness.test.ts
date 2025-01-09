// Example bigram frequencies (normalized to sum to 1)
const bigramFrequencies: Record<string, number> = {
    "de": 0.05,
    "en": 0.04,
    "ij": 0.02,
    "oo": 0.03,
    "aa": 0.03,
    "ch": 0.02,
    "ee": 0.04,
    "eu": 0.01,
    "ui": 0.01,
    // Add more bigram frequencies here
  };
  
/**
 * Calculate the fitness score of a given text based on its likelihood of being valid Dutch.
 * @param text - The input text to evaluate.
 * @returns The fitness score (0 to 1).
 */
function score(text: string): number {
    // Normalize the text: convert to lowercase and remove non-alphabetic characters
    const normalizedText = text.toLowerCase().replace(/[^a-zäöüßij\s]/g, "");
    const words = normalizedText.split(/\s+/);

    // Word match score
    const wordMatchCount = words.filter((word) => dutchWords.has(word)).length;
    const wordMatchScore = wordMatchCount / Math.max(words.length, 1);

    // Stop word match score
    const stopWordCount = words.filter((word) => stopWords.has(word)).length;
    const stopWordScore = stopWordCount / Math.max(words.length, 1);

    // Bigram likelihood score
    let bigramLikelihood = 0;
    let bigramCount = 0;

    for (let i = 0; i < normalizedText.length - 1; i++) {
        const bigram = normalizedText.slice(i, i + 2);
        if (bigramFrequencies[bigram]) {
            bigramLikelihood += bigramFrequencies[bigram];
            bigramCount++;
        }
    }

const bigramScore = bigramCount > 0 ? bigramLikelihood / bigramCount : 0;
    // Penalize for unlikely text lengths
    const lengthPenalty = normalizedText.length >= 10 && normalizedText.length <= 100 ? 0 : -1;

    // Combine scores
    const fitness = 0.5 * wordMatchScore + 0.3 * stopWordScore + 0.2 * bigramScore + lengthPenalty;
    return Math.max(fitness, 0); // Ensure fitness is non-negative
}


export default score;