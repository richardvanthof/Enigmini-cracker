import {readTextFromFile, normalize, scoreNGrams, scoreString} from './calculateNGrams';
import {it, expect, describe } from 'vitest';
import { bigram } from 'n-gram';

it('imports corpus text', async () => {
    const text = await readTextFromFile('src/data/corpus.txt');
    expect(text).toBeDefined();
})

it('normalizes corpus test', async ()=> {
    const text = `1	$8mrd echt kapitaal als verliezen op obligaties tellen.
2	€1,25 extra als ze ook een toetje en een flesje water willen.
3	€ 1 voor een postzegel met die kop van Willem A. erop en dan pas na een week te horen krijgen dat je kaartje bezorgd is?`
    const target = "mrdechtkapitaalalsverliezenopobligatiestellenextraalszeookeentoetjeeneenflesjewaterwillenvooreenpostzegelmetdiekopvanwillemaeropendanpasnaeenweektehorenkrijgendatjekaartjebezorgdis";
    const normalized = await normalize(text.substring(0,243));
    expect(normalized).toBe(target);
});

it('score nGrams', async () => {
    const text = "mrdechtkapitaalalsverliezenopobligatiestellenextraalszeookeentoetjeeneenflesjewaterwillenvooreenpostzegelmetdiekopvanwillemaeropendanpasnaeenweektehorenkrijgendatjekaartjebezorgdis";
    const biGram = bigram(text);
    const nGrams = await scoreNGrams(biGram);
    // console.log(nGrams)
    expect(nGrams).toBeDefined();
});

describe('scores nGrams correctly', () => { 
    const dutch = "Hallo wereld, ik ben een zin die jij moet scoren.";
    const middle = "I_’_EN’GEEN’AN,ERE’LAN,END’ZEL;X’AL’UEN’I_’ER’GEWEEXH.N"
    const random = 'DW:WGB:RGGB:NBSGOG:"NBSGBC:!G"J’:N":FGB:DW:GO:RGIGG’,ZB';
    it('scores bigrams correctly', async () => {

        
        const type = 'bi'
        const score1 = await scoreString(dutch, type);
        const score2 = await scoreString(middle, type);
        const score3 = await scoreString(random, type);
    
        // console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
    
    it('scores trigram correctly', async () => {
        
        const type = 'tri'
        const score1 = await scoreString(dutch, type);
        const score2 = await scoreString(middle, type);
        const score3 = await scoreString(random, type);
    
        // console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
    
    it('score quadgrams correctly', async () => {
        
        const type = 'quad'
        const score1 = await scoreString(dutch, type);
        const score2 = await scoreString(middle, type);
        const score3 = await scoreString(random, type);
    
        // console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
})




