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
const enigmini = new Enigmini(keymap, rotorConfig, reflector)

const assignment0 = enigmini.encrypt(crypt);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <article>
    <h1>Enigmini results</h1>
    <h2>0. Prove that my encryption implementation works<h2>
    <ul>
    <li><p>Sample string:</p> <code>${plain}</code></li>
    <li><p>Encrypted ref:</p> <code>${crypt}</code></li>
    <li><p>Enigmini encryption:</p> <code>${assignment0}</code></li>
    <li><p>Enigmini decryption:</p> <code>${enigmini.crypt(assignment0)}</code></li>
    </ul>
  </article>
`



console.log('hello world')


