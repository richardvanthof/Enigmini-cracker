import { readFile } from 'fs/promises';

const dutchLetterFreq: Record<string, number> = {
  e: 0.1891, n: 0.1003, a: 0.0786, t: 0.0764, i: 0.0649, r: 0.0633,
  o: 0.061, d: 0.0591, s: 0.0385, l: 0.0351, g: 0.0344, v: 0.0279,
  h: 0.023, k: 0.0225, m: 0.0216, u: 0.0185, b: 0.016, p: 0.0155,
  j: 0.0146, z: 0.0134, w: 0.0121, y: 0.0075, c: 0.0058, f: 0.0051,
  x: 0.0003, q: 0.0002
};

const defaultWordHints = [
  'de','het','een','en','van','ik','niet','op','voor','dat','met','dit','is','aan'
];

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z\s]/g, '');

function shannonEntropy(text: string): number {
  const freq: Record<string, number> = {};
  for (const c of text) freq[c] = (freq[c] || 0) + 1;
  const total = text.length || 1;
  return -Object.values(freq).reduce((sum, count) => {
    const p = count / total;
    return sum + p * Math.log2(p);
  }, 0);
}

function letterFrequencyScore(text: string): number {
  const clean = normalize(text).replace(/\s+/g, '');
  if (clean.length === 0) return 0;
  const freq: Record<string, number> = {};
  for (const c of clean) freq[c] = (freq[c] || 0) + 1;
  const total = clean.length;
  let score = 0;
  const letters = Object.keys(dutchLetterFreq);
  for (const l of letters) {
    const expected = dutchLetterFreq[l] || 0;
    const actual = (freq[l] || 0) / total;
    score += 1 - Math.abs(expected - actual);
  }
  return score / letters.length; // 0..1-ish
}

function wordMatchRatio(text: string, wordSet: Set<string>): number {
  const words = normalize(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  let known = 0;
  for (const w of words) if (w.length > 1 && wordSet.has(w)) known++;
  return known / words.length; // 0..1
}

class DutchFitnessEvaluator {
  private wordSet: Set<string> = new Set(defaultWordHints);
  private hasReference = false;

  async addReference(filePath: string): Promise<boolean> {
    try {
      const content = await readFile(filePath, 'utf8');
      // Expect a word list with one word per line or whitespace separated tokens
      const tokens = content.split(/\s+/).map(t => t.trim().toLowerCase()).filter(Boolean);
      console.log(tokens);
      if (tokens.length > 0) {
        this.wordSet = new Set(tokens);
        this.hasReference = true;
        return true;
      }
      return false;
    } catch (err) {
      // keep default hints when file read fails
      return false;
    }
  }

  async score(text: string): Promise<number> {
    const norm = normalize(text);
    if (!norm || norm.length === 0) return 0;

    const freqScore = letterFrequencyScore(norm); // 0..~1
    const wordScore = wordMatchRatio(norm, this.wordSet); // 0..1
    const entropy = shannonEntropy(norm.replace(/\s+/g, ''));

    // entropy penalty: natural language has moderate entropy; too high or too low reduces score
    const entropyPenalty = entropy > 4.5 ? 0.6 : entropy < 2 ? 0.7 : 1;

    // weighting: word matches are strong indicator, then letter frequency
    const combined = (0.55 * wordScore + 0.45 * freqScore) * entropyPenalty;

    // if a reference was loaded, boost sensitivity slightly
    const final = this.hasReference ? Math.min(1, combined * 1.05) : Math.min(1, combined);
    return final;
  }
}

export default DutchFitnessEvaluator;