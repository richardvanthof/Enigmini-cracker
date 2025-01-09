import * as fs from 'fs';
import { bigram, trigram, nGram } from 'n-gram';

const readTextFromFile = async (filePath: string): Promise<string> => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        return '';
    }
};

const normalize = async (text: string): Promise<string> => {
    const normalized = text.toLowerCase()
        .split('\n')
        .map(line => line.replace(/^\d+\t/, ''))
        .join('')
        .replace(/[^\w\s]|_/g, '') // Remove punctuation and special characters
        .replace(/\d+/g, '') // Remove numbers
        .replace(/\s+/g, '') // Remove spaces
    
    return normalized;
}

/**Figure out for each nGram how likely it is to occur in the source text corpus.*/
const scoreNGrams = (ngramsList: string[]): Map<string, number> => {
    const occurences = ngramsList.reduce((acc, ngram) => {
        acc.set(ngram, (acc.get(ngram) || 0) + 1);
        return acc;
    }, new Map<string, number>());

    const totalNGrams = ngramsList.length;

    for (const [key, value] of occurences.entries()) {
        const probability = value / totalNGrams;
        occurences.set(key, probability);
    }

    return occurences;
};

interface NGrams {
    bi: Map<string,number>,
    tri: Map<string,number>,
    quad: Map<string,number>,
}

const generateNGrams = async (sourceDataPath: string):Promise<NGrams> => {
    let text = await readTextFromFile(sourceDataPath)
    const normalized = await normalize(text);
    
    const ngrams = {
        bi: bigram(normalized),
        tri: trigram(normalized),
        quad: nGram(4)(normalized)
    }

    return {
        bi: scoreNGrams(ngrams.bi),
        tri: scoreNGrams(ngrams.tri),
        quad: scoreNGrams(ngrams.quad)
    }
}

let nGrams:NGrams;

const scoreString = async (text: string, type: 'bi' | 'tri' | 'quad'): Promise<number> => {
    if (!nGrams) {
        nGrams = await generateNGrams('src/data/corpus.txt');
    }
    const nGramList = nGrams[type];
    const normalizedText = text.toLowerCase();
    
    const nGramType = type === 'bi' ? 2 : type === 'tri' ? 3 : 4;
    
    let score = 0;

    for (let i = 0; i < normalizedText.length - nGramType + 1; i++) {
        const currentNGram = normalizedText.slice(i, i + nGramType);
        const probability = nGramList.get(currentNGram) ?? 1 / nGramList.size;
        score += Math.log(probability);
    }

    // Calculate min and max possible scores
    const minScore = normalizedText.length * Math.log(1 / nGramList.size);
    const maxScore = 0; // log(1) is 0

    // Normalize the score to a value between 0 and 1
    const normalizedScore = (score - minScore) / (maxScore - minScore);

    return normalizedScore;
};

export {readTextFromFile, normalize, generateNGrams, scoreNGrams, scoreString};
export default scoreString;
