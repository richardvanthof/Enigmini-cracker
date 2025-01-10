import Rotor from "../../classes/Rotor/Rotor";
import Enigmini from "../../classes/Enigmini/Enigmini";
import { operations, reflector, keymap } from "../../config";
import { markDiffs } from "../../lib/Logger";

const assignment0 = async () => {
    // Reference string
    const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
    const cypher = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";
  
    const rotorConfig = [new Rotor(operations.rotor1, 1), new Rotor(operations.rotor2, 6)];
  
    const rotorA = new Rotor(operations.rotor1, 1);
    const rotorB = new Rotor(operations.rotor2, 6);
  
    const enigmini = new Enigmini(keymap, rotorConfig, reflector);
    const enigmini2 = new Enigmini(keymap, [rotorA, rotorB], reflector);
  
    const encryption = markDiffs(await enigmini.encrypt(plain), cypher);
    const decrpytion = markDiffs(await enigmini2.decrypt(cypher), plain);
  
    console.log(`
      # Enigmini results
      0. prove that encryption algorithm works
      
      Encrypt:
      REF: ${encryption.ref} 
      RES: ${encryption.diff}
      Differences: ${encryption.count} (${encryption.count/cypher.length*100}%)
      
      Decrypt:
      REF: ${decrpytion.ref}
      RES: ${decrpytion.diff}
      Differences: ${decrpytion.count} (${decrpytion.count/plain.length*100}%)
      `);
};

export default assignment0;