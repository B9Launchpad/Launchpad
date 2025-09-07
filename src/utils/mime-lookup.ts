import mimeDb from './mime-db.json'; // JSON Database

type MimeEntry = {
  source?: string;
  extensions?: string[];
  compressible?: boolean;
  charset?: string;
};

// Lookup table construction
const extensionToMime: Record<string, string> = {};
const mimeToExtensions: Record<string, string[]> = {};

for (const [mimeType, info] of Object.entries(mimeDb) as [string, MimeEntry][]) {
  if (info.extensions) {
    mimeToExtensions[mimeType] = info.extensions;
    for (const ext of info.extensions) {
      extensionToMime[ext] = mimeType;
    }
  }
}

// Lookup function export
export function getMimeType(filenameOrExtension: string): string | undefined {
  const ext = filenameOrExtension.toLowerCase().split('.').pop();
  if (!ext) return undefined;
  return extensionToMime[ext];
}


export function getExtensionsForMimeType(mimeType: string): string[] | undefined {
  return mimeToExtensions[mimeType.toLowerCase()];
}

