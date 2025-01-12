import {normalizeSource, scoreNGram, scoreString, generateNGram} from './calculateNGrams';
import {it, expect, describe } from 'vitest';
import { bigram } from 'n-gram';


it('normalizes corpus test', async ()=> {
    const text = `1	$8mrd echt kapitaal als verliezen op obligaties tellen.
2	€1,25 extra als ze ook een toetje en een flesje water willen.
3	€ 1 voor een postzegel met die kop van Willem A. erop en dan pas na een week te horen krijgen dat je kaartje bezorgd is?`
    const target = "mrdechtkapitaalalsverliezenopobligatiestellenextraalszeookeentoetjeeneenflesjewaterwillenvooreenpostzegelmetdiekopvanwillemaeropendanpasnaeenweektehorenkrijgendatjekaartjebezorgdis";
    const normalized = await normalizeSource(text.substring(0,243));
    expect(normalized).toBe(target);
});

it('score nGrams', async () => {
    const text = "mrdechtkapitaalalsverliezenopobligatiestellenextraalszeookeentoetjeeneenflesjewaterwillenvooreenpostzegelmetdiekopvanwillemaeropendanpasnaeenweektehorenkrijgendatjekaartjebezorgdis";
    const biGram = bigram(text);
    const nGrams = await scoreNGram(biGram);
    // console.log(nGrams)
    expect(nGrams).toBeDefined();
});

describe('generates nGrams', () => {
    const corpus = "1	$8mrd echt kapitaal als verliezen op obligaties tellen. 2	€1,25 extra als ze ook een toetje en een flesje water willen.3	€ 1 voor een postzegel met die kop van Willem A. erop en dan pas na een week te horen krijgen dat je kaartje bezorgd is?"
  
    it('generates biGram', async () => {
        const result = await generateNGram(corpus, 'bigram');
        expect(result).toHaveLength(112);
    });

    it('generates trigram', async () => {
        const result = await generateNGram(corpus, 'trigram');
        expect(result).toHaveLength(161);
    });

    it('generates quadgram', async () => {
        const result = await generateNGram(corpus, 'quadgram')
        expect(result).toHaveLength(173);
    })
})

describe('scores nGrams correctly', () => { 
    const corpus = "1	$8mrd echt kapitaal als verliezen op obligaties tellen. 2	€1,25 extra als ze ook een toetje en een flesje water willen.3	€ 1 voor een postzegel met die kop van Willem A. erop en dan pas na een week te horen krijgen dat je kaartje bezorgd is?"
    const dutch = "Hallo wereld, ik ben een zin die jij moet scoren.";
    const middle = "I_’_EN’GEEN’AN,ERE’LAN,END’ZEL;X’AL’UEN’I_’ER’GEWEEXH.N"
    const random = 'DW:WGB:RGGB:NBSGOG:"NBSGBC:!G"J’:N":FGB:DW:GO:RGIGG’,ZB';
    it('scores bigrams correctly', async () => {
        const nGram = await generateNGram(corpus, 'bigram');
        const score1 = await scoreString(dutch, nGram);
        const score2 = await scoreString(middle, nGram);
        const score3 = await scoreString(random, nGram);
    
        console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
    
    it('scores trigrams correctly', async () => {
        const nGram = await generateNGram(corpus, 'trigram');
        const score1 = await scoreString(dutch, nGram);
        const score2 = await scoreString(middle, nGram);
        const score3 = await scoreString(random, nGram);
    
        // console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
    
    it('scores quadgrams correctly', async () => {
        const nGram = await generateNGram(corpus, 'quadgram');
        const score1 = await scoreString(dutch, nGram);
        const score2 = await scoreString(middle, nGram);
        const score3 = await scoreString(random, nGram);
    
        // console.log({score1, score2, score3})
        const order = score1 > score2 && score2 > score3;
        expect(order).toBe(true);
    });
})




