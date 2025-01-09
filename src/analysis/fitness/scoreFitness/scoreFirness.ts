import calculateNGram from "../calculateNGram/calculateNGrams";
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
async function scoreFitness(text: string): Promise<number> {
    const normalizedText = normalize(text);
    const quadGramScore = await calculateNGram(normalizedText, 'quad');
    const biGramScore = await calculateNGram(normalizedText, 'bi');
    const wordMatchScore = await calculateMatchWord(normalizedText);
    
    // Penalize for unlikely text lengths
    const lengthPenalty = normalizedText.length >= 10 ? 0 : -1;

    // Combine scores
    const fitness = 0.5 * wordMatchScore + 0.25 * biGramScore + 0.25 * quadGramScore + lengthPenalty;
    return Math.max(fitness, 0); // Ensure fitness is non-negative
}
  

export default scoreFitness;