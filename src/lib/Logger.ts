import {mkdir, writeFile, appendFile} from 'fs/promises';
import { existsSync, mkdirSync} from 'fs';
import path from 'path';

const saveToFile = async (filePath: string, content: string, type: 'overwrite'|'append' = 'overwrite') => {
    // Ensure the directory exists
    const folder = path.dirname(filePath);
    try {
        // Check if the directory exists, and create it if it doesn't
        await mkdir(folder, { recursive: true });

        // Write content to the file
        if(type === 'overwrite') {
            await writeFile(filePath, content + '\n');
        } else {
            await appendFile(filePath, content + '\n')
        }
        // console.log('Content successfully written to file');
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
};

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
const logToCSV = async (entries:Map<string, unknown>[], filePath:string):string => {
    
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

    // Ensure the directory exists
    const folder = path.dirname(filePath)
    if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true });
    }

    // Write the CSV data to a file
    await writeFile(filePath, csv);

    return csv;
}

export {saveToFile, markDiffs, logToCSV}

export default saveToFile;