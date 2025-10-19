const { readdirSync, statSync, writeFileSync } = require('fs');
const { join } = require('path');

function generateManifest() {
  const settingsPath = join(process.cwd(), 'src', 'components', 'settings');
  const manifest = [];

  const scanDirectory = (dir) => {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const isDirectory = statSync(fullPath).isDirectory();
      
      if (isDirectory) {
        const indexPath = join(fullPath, 'manifest.ts');
        try {
          statSync(join(fullPath, 'manifest.ts')).isFile()
        } catch {
          throw new Error(`mannifest.ts not found for settings module "${item}" in ${fullPath}`)
        }
        try {
          if (statSync(indexPath).isFile()) {
            const importPath = `${item}/manifest.ts`;
            manifest.push({
              path: importPath,
              name: item
            });
          }
        } catch {
          throw new Error(`index.tsx not found for settings module ${item} in ${fullPath}`)
        }
        scanDirectory(fullPath);
      }
    }
  };

  scanDirectory(settingsPath);
  
  writeFileSync(
    join(process.cwd(), 'src', 'components', 'settings', 'settings-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

generateManifest();