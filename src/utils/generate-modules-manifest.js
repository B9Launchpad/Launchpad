const { readdirSync, statSync, writeFileSync } = require('fs');
const { join, extname } = require('path');

function generateManifest() {
    const modulesPath = join(process.cwd(), 'src', 'modules');
    const manifest = [];

    const scanModules = (dir) => {
        const items = readdirSync(dir);

        for (const item of items) {
            const fullPath = join(dir, item);
            const isDirectory = statSync(fullPath).isDirectory();

            if (isDirectory) {
                const manifestPath = join(fullPath, 'module.manifest.ts');

                try {
                    if (statSync(manifestPath).isFile()) {
                        const settingsDir = join(fullPath, 'settings');
                        const hasSettings = statSync(settingsDir).isDirectory();

                        const localesDir = join(fullPath, 'locales')
                        let hasLocales = statSync(localesDir).isDirectory();

                        if(hasLocales) {
                            hasLocales = readdirSync(localesDir).filter(file => extname(file).toLowerCase() === '.json');
                        }

                        manifest.push({
                            module: item,
                            manifestPath: `${item}/module.manifest.ts`,
                            hasSettings: hasSettings,
                            locales: hasLocales
                        });
                    }
                } catch (error) {
                    if (error.code === 'ENOENT') {
                        console.warn(`module.manifest.ts not found for module "${item}" in ${fullPath}`);
                        continue;
                    }
                    throw error;
                }
            }
        }
    };

    scanModules(modulesPath);

    writeFileSync(
        join(process.cwd(), 'src', 'modules', 'modules.manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
}

generateManifest();