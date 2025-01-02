import * as fs from 'fs';

let entries = [];
const log = (_value: unknown) => {
    let value = _value;

   // console.log(value);

    if(typeof value === 'object') {
        value = JSON.stringify(value)
    }
    entries.push(value);
};

const saveToFile = async (path: string) => {
    await fs.appendFile(path, entries.join('\n'), (err) => {
        if(err) {console.error('Failed to write to log file', err)}
    })
}

type Diff = {
    ref: string,
    diff: string,
    count: number,
  }

/**returns the differences between two similar strings.*/
const markDiffs = (_value: string, _ref: string):Diff => {
    const value = _value.split('');
    const ref = _ref.split('');
    let result:{ref: string[], diff: string[], count: number} = {
        ref: [],
        diff: [],
        count: 0
    };

    value.forEach((char, index) => {
        const target = ref[index];
        if(char !== target) {
        result.ref.push(`\x1b[31m${target}\x1b[0m`);
        result.diff.push(`\x1b[31m${char}\x1b[0m`);
        result.count++;
        } else {
        result.diff.push(`\x1b[0m${char}\x1b[0m`);
        result.ref.push(`\x1b[0m${target}\x1b[0m`);
        }
    });
    return {
        ref: result.ref.join(''),
        diff: result.diff.join(''),
        count: result.count,
    }
};

export {saveToFile, markDiffs}

export default log;