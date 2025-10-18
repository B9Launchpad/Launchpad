import keyMap from './keycap-map.json';

type KeyEntry = {
    windows: number,
    macos: number
};

// Lookup table construction
const nameToMacCode: Record<string, number> = {};
const nameToWindowsCode: Record<string, number> = {}
//const codeToName: Record<string, string[]> = {};

for (const [keyName, code] of Object.entries(keyMap) as [string, KeyEntry][]) {
    if (code.windows && code.macos) {
        nameToMacCode[keyName] = code.macos;
        nameToWindowsCode[keyName] = code.windows;
    }
}

// Lookup function export
export function getCodeForKeyName(keyName: string, map: 'windows' | 'macos'): number | undefined {
    switch(map) {
        case 'windows':
            return nameToWindowsCode[keyName];
        case 'macos':
            return nameToMacCode[keyName]
    }
}

