import { bigram, trigram, nGram } from 'n-gram';

const normalizeSource = async (text: string): Promise<string> => {
  if (!text) throw new Error('Input text is empty.');
  
  const normalized = text
    .toLowerCase()
    .split('\n')
    .map(line => line.replace(/^\d+\t/, '')) // Remove leading numbers and tab
    .join('') // Remove newlines between lines
    .replace(/[^\w\s]|_/g, '') // Remove punctuation and special characters
    .replace(/\d+/g, '') // Remove numbers
    .replace(/\s+/g, ''); // Remove spaces

  return normalized;
};

/** Figure out for each nGram how likely it is to occur in the source text corpus. */
const scoreNGram = (ngramsList: string[], amount?: number): Map<string, number> => {

  // get all unique ngrams and count their occurences
  let occurences = ngramsList.reduce((acc, current) => {
    acc.set(current, (acc.get(current) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  // sort the occurences by the amount and take the top n
  occurences = new Map([...occurences.entries()].sort((a, b) => b[1] - a[1]).slice(0, amount));
  
  const totalNGrams = ngramsList.length;
  occurences.forEach((value, key) => {
    occurences.set(key, Math.log10(value / totalNGrams)); // Log-Probability of each n-gram
  });
  
  // console.log(occurences)

  return occurences;
};

const generateNGram = async (
  sourceText: string,
  type: 'bigram' | 'trigram' | 'quadgram'
): Promise<Map<string, number>> => {
  const normalized = await normalizeSource(sourceText);
  let ngram: string[];

  switch (type.toLowerCase()) {
    case 'bigram':
      ngram = bigram(normalized);
      break;
    case 'trigram':
      ngram = trigram(normalized);
      break;
    case 'quadgram':
      ngram = nGram(4)(normalized);
      break;
    default:
      throw new Error('Invalid n-gram type.');
  };

  return scoreNGram(ngram);
};

const scoreString = async (
  text: string,
  nGramRef: Map<string, number>
): Promise<number> => {
  if (!text) throw new Error('Input string undefined.');
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');

  /**Determine if input nGram should be bigram, trigram or quadGram */
  const nGramLength = Array.from(nGramRef.keys())[0].length;
  const inputNGram: string[] = nGram(nGramLength)(normalizedText);
  
  let score = 0;

  inputNGram.forEach((chunk) => {
    if (chunk) {
      const probability = nGramRef.get(chunk) ?? 0;

      // Only add to the score if probability > 0
      if (probability) {
        score += probability;
      } else {
        score += Math.log10(1e-6); // Log-Probability of 1e-6
      }
    }
  });

  let normalizedScore = score / inputNGram.length;
  // console.log(normalizedScore)
  return normalizedScore;
};

export { normalizeSource, generateNGram, scoreNGram, scoreString };
export default scoreString;
