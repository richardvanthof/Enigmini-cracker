import {readTextFromFile, normalize, scoreNGrams} from './generateNGrams';
import {it, expect } from 'vitest';
import { bigram } from 'n-gram';

it('imports corpus text', async () => {
    const text = await readTextFromFile('src/data/corpus.txt');
    expect(text).toBeDefined();
})

it('normalizes corpus test', async ()=> {
    const text = `1	$8mrd echt kapitaal als verliezen op obligaties tellen.
2	€1,25 extra als ze ook een toetje en een flesje water willen.
3	€ 1 voor een postzegel met die kop van Willem A. erop en dan pas na een week te horen krijgen dat je kaartje bezorgd is?`
    const target = "MRDECHTKAPITAALALSVERLIEZENOPOBLIGATIESTELLENEXTRAALSZEOOKEENTOETJEENEENFLESJEWATERWILLENVOOREENPOSTZEGELMETDIEKOPVANWILLEMAEROPENDANPASNAEENWEEKTEHORENKRIJGENDATJEKAARTJEBEZORGDIS";
    const normalized = await normalize(text.substring(0,243));
    expect(normalized).toBe(target);
});

it('score nGrams', async () => {
    const text = "$8MRDECHTKAPITAALALSVERLIEZENOPOBLIGATIESTELLEN. €1,25 EXTRA ALS ZE OOK EEN TOETJE EN EEN FLESJE WATER WILLEN. € 1 VOOR EEN POSTZEGEL MET DIE KOP VAN WILLEM A. EROP EN DAN PAS NA EEN WEEK TE HOREN KRIJGEN DAT JE KAARTJE BEZORGD IS";
    const biGram = bigram(text);
    const nGrams = await scoreNGrams(biGram);
    expect(nGrams).toBeDefined();
});

