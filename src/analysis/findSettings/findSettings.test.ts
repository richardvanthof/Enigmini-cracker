import { vi, it, describe, expect } from 'vitest';
import { createSettingStore } from './findSettings';
import type { KnownSettings } from './findSettings';

describe('creates setting store', () => {
    it('creates store', () => {
        const knownSettings: KnownSettings = {
            cypher: '1234',
            plugBoard: [[1, 2], [2, 3]],
            keyMap: [
                ['A', 'B'],
                ['C', 'D']
            ],
        };

        const target:any= new Map([
            //@ts-nocheck
            ['cypher', knownSettings.cypher],
            ['plugBoard', knownSettings.plugBoard],
            ['keyMap', knownSettings.keyMap],
            ['score', 0],
            ['plain', ''],
            ['rotor', []],
            ['reflector', []]
        ]);

        // Expect the result of createSettingStore to be the same as the target map
        expect(createSettingStore(knownSettings)).toStrictEqual(target);
    });
});

