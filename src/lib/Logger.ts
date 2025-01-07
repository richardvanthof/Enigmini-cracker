import * as fs from 'fs';

let entries:any[] = [];

// class Logger {
//     constructor() {
//         this.rows = [];
//         this.entry = new Map();
//     };

//     addEntry(key, value) {
//         this.addEntry.set(key, value);
//     }

//     add
// }

const log = (_value: unknown) => {
    let value = _value;

   // console.log(value);

    if(typeof value === 'object') {
        value = JSON.stringify(value)
    }
    entries.push(value);
};

const saveToFile = async (path: string) => {
    await fs.writeFile(path, entries.join('\n'), (err) => {
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

    value.forEach((char, index):void => {
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

// Function to convert the list of maps to CSV format
const logToCSV = async (entries:Map<string, unknown>[], file:string):string => {
    
    if (entries.length === 0) {
        throw Error('List of maps is empty');
    }

    // Extract headers from the keys of the first map (assuming all maps have the same structure)
    const headers = Array.from(entries[0].keys());

    // Create the CSV rows
    const rows = entries.map(map => {
    return headers.map(header => map.get(header)).join('|');
    });

    // Combine headers and rows into a full CSV string
    const csv = [headers.join('|'), ...rows].join('\n');

    // Optionally write the CSV data to a file
    await fs.writeFileSync(file, csv);

    return csv;
}

export {saveToFile, markDiffs, logToCSV}

export default log;