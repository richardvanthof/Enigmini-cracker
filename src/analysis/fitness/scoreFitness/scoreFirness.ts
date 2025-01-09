import calculateNGram from "../calculateNGram/calculateNGrams";
import calculateIOC from "../calculateIOC/calculateIOC";
import calculateMatchWord from "../calculateWordMatch/calculateWordMatch";

const normalize = (text: string): string => {
    // Normalize the text: convert to lowercase and remove non-alphabetic characters
    return text.toLowerCase().replace(/[^a-zäöüßij\s]/g, "");
}

/**
 * Calculate the fitness score of a given text based on its likelihood of being valid Dutch.
 * @param text - The input text to evaluate.
 * @returns The fitness score (0 to 1).
*/
function scoreFitness(text: string): number {
    const normalizedText = normalize(text);
    const quadgram = calculateNGram(normalizedText, 'quad');
    const biGram = calculateNGram(normalizedText, 'bi');
    const matchWord = calculateMatchWord(normalizedText);

    // Penalize for unlikely text lengths
    const lengthPenalty = normalizedText.length >= 10 && normalizedText.length <= 100 ? 0 : -1;

    // Combine scores
    const fitness = 0.5 * wordMatchScore + 0.3 * stopWordScore + 0.2 * bigramScore + lengthPenalty;
    return Math.max(fitness, 0); // Ensure fitness is non-negative
}
  

export default scoreFitness;