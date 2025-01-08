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
        const logProbability = Math.log(value / ngramsList.length);
        occurences.set(key, logProbability);
    }

    // Sort occurences by value
    const sortedOccurences = new Map([...occurences.entries()].sort((a, b) => b[1] - a[1]));

    return sortedOccurences;
};

const generateNGrams = async (sourceDataPath: string):Promise<object> => {
    let text = await readTextFromFile(sourceDataPath)
    const normalized = await normalize(text);
    console.log('Generating nGrams. One moment please...')

    const ngrams = {
        biGram: bigram(normalized),
        driGram: trigram(normalized),
        quadGram: nGram(4)(normalized)
    }

    return ngrams
}

const nGrams = generateNGrams('src/data/corpus.txt');

export {readTextFromFile, normalize, generateNGrams, scoreNGrams};
export default nGrams
