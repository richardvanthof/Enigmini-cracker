import FitnessEvaluator from './analysis/fitness/scoreFitness/scoreFirness';
import generatePlugCombinations from './analysis/generatepPlugboards/generatePlugboards';
import generateRotors from './analysis/generateRotors/generateRotors';
import assignment0 from './assignments/assignment0/assignment0';
import assignment1 from './assignments/assignment1/assignment1';
import assignment2 from './assignments/assignment2/assignment2';

// test encryption algorithm
await assignment0();

try {
    // generate Dutch language references
    const evaluator = new FitnessEvaluator();
    const added = await evaluator.addReference('src/data/corpus.txt');
    const rotors = await generateRotors([1,2,3,4,5,6]);
    const plugboards = await generatePlugCombinations([1,2,3,4,5,6]);
    const reflectors = await generatePlugCombinations([1,2,3,4,5,6], true);

    if(!added) throw new Error('reference not added')
    
    
    console.log('Assignment 1', await assignment1(evaluator, plugboards));
    const res = await assignment2(evaluator, rotors, reflectors)
    console.log('\n\nAssignment 2', res, '\n' ,res.get('rotor').map(({value, id}) => `rotor ${id} value: ${JSON.stringify(value)}`));
} catch (err) {
    console.error(err)
};  

