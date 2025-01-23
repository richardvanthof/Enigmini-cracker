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
const scoreNGram = (ngramsList: string[]): Map<string, number> => {
  const occurences = ngramsList.reduce((acc, current) => {
    acc.set(current, (acc.get(current) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  const totalNGrams = ngramsList.length;
  occurences.forEach((value, key) => {
    occurences.set(key, value / totalNGrams); // Probability of each n-gram
  });

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
  }

  return scoreNGram(ngram);
};

const scoreString = async (
  text: string,
  nGramRef: Map<string, number>
): Promise<number> => {
  if (!text) throw new Error('Input string undefined.');
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  const nGramLength = Array.from(nGramRef.keys())[0].length;
  const inputNGram: string[] = nGram(nGramLength)(normalizedText);
  let score = 0;

  inputNGram.forEach((chunk) => {
    if (chunk) {
      const count = nGramRef.get(chunk) ?? 0;
      const probability = count / nGramRef.size;

      // Only add to the score if probability > 0
      if (probability > 0) {
        score += Math.log(probability);
      }
    }
  });

  // Calculate min and max possible scores
  const minScore = normalizedText.length * Math.log(1 / nGramRef.size);
  const maxScore = 0; // log(1) is 0

  // Normalize the score to a value between 0 and 1
  const scoreRange = maxScore - minScore;
  const normalizedScore = scoreRange > 0 ? (score - minScore) / scoreRange : 0;

  return normalizedScore;
};

export { normalizeSource, generateNGram, scoreNGram, scoreString };
export default scoreString;
