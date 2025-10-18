import keyMap from './keycap-map.json';

type KeyEntry = {
    windows: string,
    macos: string,
} | string;


const nameToMacCode: Record<string, string> = {};
const nameToWindowsCode: Record<string, string> = {}

for (const [keyName, code] of Object.entries(keyMap) as [string, KeyEntry][]) {
    if (typeof code === 'string') {
        nameToMacCode[keyName] = code;
        nameToWindowsCode[keyName] = code;
    } else {
        if (code.windows) {
            nameToWindowsCode[keyName] = code.windows;
        }
        if (code.macos) {
            nameToMacCode[keyName] = code.macos;
        }
    }
}

type KeyReturn = {
    name: string | undefined,
    systemFont: boolean
}

export default function getNameForKeyValue(keyName: string, map: 'Windows' | 'MacOS' | string = 'Windows'): KeyReturn {
    if(!nameToMacCode[keyName]) return { name: keyName, systemFont: false };

    switch(map) {
        case 'MacOS':
            const isSymbol: boolean = !/[a-zA-Z]/.test(nameToMacCode[keyName])
            return {
                name: nameToMacCode[keyName],
                systemFont: isSymbol,
            }
        default:
            return {
                name: nameToWindowsCode[keyName],
                systemFont: false
            }
    }
}

