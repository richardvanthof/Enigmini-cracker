import assignment0 from './assignments/assignment0/assignment0';
import assignment1 from './assignments/assignment1/assignment1';
import assignment2 from './assignments/assignment2/assignment2';


await assignment0();
console.log({assignment1: await assignment1()});
console.log({assignment2: await assignment2()});
