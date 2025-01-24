import calculateMatchWord from "../calculateWordMatch/calculateWordMatch";
import {readFile} from 'fs/promises';
import { generateWordList } from "../calculateWordMatch/calculateWordMatch";
import { generateNGram, scoreString } from "../calculateNGram/calculateNGrams";
const normalize = (text: string): string => {
    // Normalize the text: convert to lowercase and remove non-alphabetic characters
    return text.toLowerCase().replace(/[^a-zäöüßij\s]/g, "");
}

/**
 * Check for the chance of a string to be valid language
 */
class FitnessEvaluator {

    rotorTemplate: number[][];
    sampleText: string = '';
    nGrams: Map<string, Map<string, number>>;
    wordList: Set<string>;

    constructor() {
        this.rotorTemplate = [];
        this.sampleText;
        this.nGrams = new Map();
        this.wordList = new Set();
    }

    private async getTextFromFile(filePath: string):Promise<string> {
        /**Get text from a txt file */
        try {
            return await readFile(filePath, 'utf8');
        } catch (err) {
            console.error(`Error reading file from disk: ${err}`);
            return '';
        }

    }

    private normalize(string: string) {
        // Normalize the text: convert to lowercase and remove non-alphabetic characters
        return string.toLowerCase().replace(/[^a-zäöüßij\s]/g, "");
    }
    // /**
    //  * Add new text to sample text corpus and regenerates ngrams and wordlist.
    //  * @param text - The input text to evaluate.
    //  * @returns The fitness score (0 to 1).
    // */
    async addReference(path: string):Promise<boolean>{
        try{
            const content = await this.getTextFromFile(path);
            const normalized = this.normalize(content);
            this.sampleText += normalized;
            this.wordList = await generateWordList(normalized);
            const bigram = await generateNGram(this.sampleText, 'bigram');
            const quadgram = await generateNGram(this.sampleText, 'quadgram');
            this.nGrams.set('biGram', bigram);
            this.nGrams.set('quadGram', quadgram);
            return true;
        
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    // /**
    //  * Calculate the fitness score of a given text based on its likelihood of being valid Dutch.
    //  * @param text - The input text to evaluate.
    //  * @returns The fitness score (0 to 1).
    // */
    async score(text: string):Promise<number> {
        const normalizedText = normalize(text);
        const quadGram = this.nGrams.get('quadGram');
        const biGram = this.nGrams.get('biGram');
        if (!quadGram || !biGram || this.nGrams.size == 0 || !this.sampleText || this.wordList.size === 0) {
            throw new Error('Reference text not found. Set this first using the addReference method.');
        }

        const [quadGramScore, biGramScore, wordMatchScore] = await Promise.all([
            scoreString(normalizedText, quadGram),
            scoreString(normalizedText, biGram),
            calculateMatchWord(normalizedText, this.wordList)
        ]);
        
        // Penalize for unlikely text lengths
        const lengthPenalty = normalizedText.length >= 10 ? 0 : -1;

        
        // Combine scores
        const score =  0.3 * quadGramScore + 0.3 * biGramScore + 0.4 * wordMatchScore + lengthPenalty;
        // console.log({quadGramScore, biGramScore, wordMatchScore, lengthPenalty, score});
        return score;
        
    }
}

export default FitnessEvaluator;