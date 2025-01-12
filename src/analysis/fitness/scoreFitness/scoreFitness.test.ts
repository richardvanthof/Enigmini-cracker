import { describe, it, expect, vi, beforeEach } from "vitest";
import FitnessEvaluator from "./scoreFirness";
import { fs } from 'memfs';

describe('FitnessEvaluator', () => {
    let evaluator: FitnessEvaluator;

    beforeEach(() => {
        evaluator = new FitnessEvaluator();
    });

    describe('reads text from file', () => {
        it('should read text from a file', async () => {
            const mockFilePath = '/test.txt';
            const mockFileContent = 'This is a test file.';

            // Write mock file content to memfs
            fs.writeFileSync(mockFilePath, mockFileContent);

            // Mock fs.promises.readFile to use memfs
            vi.spyOn(fs.promises, 'readFile').mockImplementation(async (filePath: string, encoding: string) => {
                return fs.readFileSync(filePath, encoding);
            });

            const result = await evaluator['getTextFromFile'](mockFilePath);
            expect(result).toBe(mockFileContent);
        });

        it('should handle errors when reading a file', async () => {
            const mockFilePath = '/nonexistent.txt';

            // Mock fs.promises.readFile to throw an error
            vi.spyOn(fs.promises, 'readFile').mockImplementation(async () => {
                throw new Error('File not found');
            });

            const result = await evaluator['getTextFromFile'](mockFilePath);
            expect(result).toBe('');
        });
    });

    describe('addReference', () => {
        it('should add reference text and generate ngrams and wordlist', async () => {
            const mockFilePath = '/reference.txt';
            const mockFileContent = 'This is a reference text.';

            // Write mock file content to memfs
            fs.writeFileSync(mockFilePath, mockFileContent);

            // Mock fs.promises.readFile to use memfs
            vi.spyOn(fs.promises, 'readFile').mockImplementation(async (filePath: string, encoding: string) => {
                return fs.readFileSync(filePath, encoding);
            });

            await evaluator.addReference(mockFilePath);

            expect(evaluator.sampleText).toBe('this is a reference text');
            expect(evaluator.wordList.size).toBeGreaterThan(0);
            expect(evaluator.nGrams.size).toBe(2);
        });
    });

    describe('score', () => {
        it('should calculate the fitness score of a given text', async () => {
            const mockFilePath = '/reference.txt';
            const mockFileContent = 'This is a reference text.';

            // Write mock file content to memfs
            fs.writeFileSync(mockFilePath, mockFileContent);

            // Mock fs.promises.readFile to use memfs
            vi.spyOn(fs.promises, 'readFile').mockImplementation(async (filePath: string, encoding: string) => {
                return fs.readFileSync(filePath, encoding);
            });

            await evaluator.addReference(mockFilePath);

            const textToScore = 'This is a test text.';
            const score = await evaluator.score(textToScore);

            expect(score).toBeGreaterThan(0);
        });

        it('should throw an error if reference text is not set', async () => {
            const textToScore = 'This is a test text.';

            await expect(evaluator.score(textToScore)).rejects.toThrow('Reference text not found. Set this first using the addReference method.');
        });
    });
});