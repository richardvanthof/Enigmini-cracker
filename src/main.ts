import './style.css'
import Enigmini from './classes/Enigmini/Enigmini';
import Rotor from './classes/Rotor/Rotor';

const keymap = [
  ["O", "N", ["1", "!"], "C", "S", "X"],
  ["I", "G", "L", ["3", "."], "H", "T"],
  [["5", '"'], "Z", "R", "A", ["8", ","], "D"],
  ["P", ["6", ":"], "W", "E", ["2", "?"], "J"],
  ["F", "K", "U", ["0", "#"], "Y", "Q"],
  [["9", ";"], ["7", "_"], "B", ["4", "’"], "M", "V"]
];

const reflector = [
[1, 5],
[2, 4],
[3, 6],
[4, 2],
[5, 1],
[6, 3]
];

const rotor1 = [
[1, 2],
[2, 5],
[3, 4],
[4, 6],
[5, 1],
[6, 3]
];

const rotor2 = [
[1, 3],
[2, 1],
[3, 5],
[4, 6],
[5, 2],
[6, 4]
];

// Reference string
const plain = "DEZE VOORBEELDTEKST IS VERCIJFERD MET DE ENIGMINI!";
const crypt = "KRY8D1D37CRLE9NS906LJ4D1KVT2ZDL4KHU86LF8D5AC1OYMJE";

const rotorConfig = [new Rotor(rotor1, 1), new Rotor(rotor2, 6)];
const enigmini = new Enigmini(keymap, rotorConfig, reflector);

const assignment0 = enigmini.encrypt(plain);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <article>
  <h1>Enigmini results</h1>
  <div>
  <h2>a. Prove that my encryption implementation works!<h2>
  <ul class="table">
  <p class="label">Plain text ref.:</p>
  <code>${plain}</code>
  <p class="label">Encrypted ref:</p>
  <code>${crypt}</code>
  <p class="label">Enigmini encryption:</p>
  <code>${assignment0}</code>
  </ul>
  </div>
  <div>
  <h2>b. Find plugboard config</h2>
  <p>b. Gegeven is dezelfde beginconfiguratie als in het voorbeeld, maar met een ander stekkerbord.
Geef de titel: <code>UCXOMDTVHMAXJCO6PKSJJ5P4Y18EMYUO2KOGDM31QXT31SEV8JH116</code></p>
  </div>
<div>
  <h2>b. Find plugboard config</h2>
  <p>b. Gegeven is dezelfde beginconfiguratie als b. maar met andere rotoren en reflectoren. Geef
de titel: <code>0ULW2BHR3SJALF5P2FWCYONLHPFW7YZN84UPQWNKMTYIEYTYN2QE63SJBLFV6SQE9Y27E2</code></p>
  </div>
  </article>
`



console.log('hello world')


