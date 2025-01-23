# Enigmini cracker

![program](src/assets/program.png)

As a programming exercise I tried to solve an assignment from the 2024 AIVD Kerstpuzzel (Chrismas puzzle) where I had to implement an Enigma-like encryption algorithm and use it to crack some cyphers. This was a nice challange to play with simple encryption and combinatronics in Node.js.

- [View instructions (Dutch)](src/assets/KP2024+final+1.02.jpg)

## 🚀 Get started

#### Instructions


1. Clone this repo.
2. Install depencies: `yarn install`.
3. Run script: `yarn start`

## 👾 Commands

- `yarn install`
  Install depencencies.

- `yarn start`
  Run script

- `yarn test`
  Run unit tests.

## 🗂️ Project structure

- `src/assignments/`: contain the assignments.
- `src/classes/`: contain components for encyryption algorithm
- `src/data/`: contains Dutch sample text for scoring if a string on likelyhood of containing Dutch.
- `src/analysis`: contains functions for bruteforcing the algorithm aka.:
  -  Looping through all settings (aka. the findSettings functions)
  -  Generating all versions of a certain setting ('generate functions)
  -  Evaluating if a certain setting is correct and if the output contains natural language (aka. fitness functions).
    - currently doing this using ngrams and wordlists   
