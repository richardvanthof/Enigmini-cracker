import { bigram, trigram, nGram } from 'n-gram';

const normalizeSource = async (text: string): Promise<string> => {
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
const scoreNGram = (ngramsList: string[]): Map<string, number> => {
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

const generateNGram = async ( sourceText: string, type: 'bigram'|'trigram'|'quadgram'):Promise<Map<string, number>> => {
    const normalized = await normalizeSource(sourceText);
    
    let ngram;
    	
    switch (type.toLowerCase()) {
        case 'bigram':
            ngram = bigram(normalized);
            break;
        case 'trigram':
            ngram = trigram(normalized);
            break;
        case 'quadgram':
            ngram = nGram(4)(normalized)
            break;
        default:
            throw new Error('type is invalid.')
            break;
    }

    return scoreNGram(ngram)
};

const scoreString = async (text: string, nGram: Map<string,number>): Promise<number> => {

    const normalizedText = text.toLowerCase();
    const nGramLength = Array.from(nGram.keys())[0].length;
    let score = 0;

    for (let i = 0; i < normalizedText.length - nGramLength + 1; i++) {
        const currentNGram = normalizedText.slice(i, i + nGramLength);
        const probability = nGram.get(currentNGram) ?? 1 / nGram.size;
        score += Math.log(probability);
    }

    // Calculate min and max possible scores
    const minScore = normalizedText.length * Math.log(1 / nGram.size);
    const maxScore = 0; // log(1) is 0

    // Normalize the score to a value between 0 and 1
    const normalizedScore = (score - minScore) / (maxScore - minScore);

    return normalizedScore;
};

export {normalizeSource, generateNGram, scoreNGram, scoreString};
export default scoreString;
