/** Normalize the text: convert to lowercase and remove non-alphabetic characters */
const normalize = (text: string): string => text.toLowerCase().replace(/[^a-zäöüßij\s]|[0-9]|\t/g, "").replace(/\n/g, " ");
/** Word match score */

const generateWordList = async (text: string):Promise<Set<string>> => {
    const wordList = normalize(text).split(' ');
    const uniques = wordList.filter((word, index) => {
        const firstOccurence = wordList.findIndex((w) => w === word);
        return index === firstOccurence
    })
    return new Set(uniques);
}


const matchWords = async (text:string, wordList:Set<string>):Promise<number> => {

    const words = normalize(text).split(/\s+/);
    // console.log({words, wordList});
    const wordMatchCount = words.filter((word) => wordList.has(word)).length;
    let score = Math.log(wordMatchCount / (Math.max(words.length, 1)));
    score = Math.max(score, Math.log10(1e-6));
    // console.log(score)
    return score; // Log-Probability of 1e-6);
};

export {generateWordList};
export default matchWords;