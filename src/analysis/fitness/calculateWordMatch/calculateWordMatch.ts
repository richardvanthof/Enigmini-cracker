import * as fs from 'fs';

/**Get text from a txt file */
const readTextFromFile = async (filePath: string): Promise<string> => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        return '';
    }
};

/** Normalize the text: convert to lowercase and remove non-alphabetic characters */
const normalize = (text: string): string => text.toLowerCase().replace(/[^a-zäöüßij\s]|[0-9]|\t/g, "").replace(/\n/g, " ");
/** Word match score */
const matchWords = async (text: string, listPath: string = 'src/data/nld_news_2023_10K-words.txt'):Promise<number> => {
    let ref = await readTextFromFile(listPath);
    if(ref.length <= 0 || !ref) {throw new Error('Word list not found.')}
    
    const wordList:Set<string> = new Set(normalize(ref).split(' '))
    const words = normalize(text).split(/\s+/);
    // console.log({words, wordList});
    const wordMatchCount = words.filter((word) => wordList.has(word)).length;
    
    return wordMatchCount / Math.max(words.length, 1);
};

export default matchWords;