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

export const saveToFile = async (path: string) => {
    await fs.appendFile(path, entries.join('\n'), (err) => {
        if(err) {console.error('Failed to write to log file', err)}
    })
}

export default log;