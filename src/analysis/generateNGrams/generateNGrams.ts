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
    const normalized = text.toUpperCase()
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
    // Count occurences off certai letter combinations in the input string.
    const occurences = ngramsList.reduce((acc, ngram) => {
        acc.set(ngram, (acc.get(ngram) || 0) + 1);
        return acc;
    }, new Map<string, number>());
    // Delete entries that have less than 10 occurences.

    // Update values
    for (const [key, value] of occurences.entries()) {
        const logProbability = Math.log(Math.floor(value) / ngramsList.length);
        occurences.set(key, logProbability);
    }

    // Sort occurences by value
    const sortedOccurences = new Map([...occurences.entries()].sort((a, b) => b[1] - a[1]));

    return sortedOccurences;
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
    const normalized = await normalize(text);
    
    const inputNGram = type === 'bi' ? bigram(normalized) : type === 'tri' ? trigram(normalized) : nGram(4)(normalized);
    
    let score = 0;
    for (const nGram of inputNGram) {
        score += nGramList.get(nGram) || 0;
    }

    return score;
};

export {readTextFromFile, normalize, generateNGrams, scoreNGrams, scoreString};

