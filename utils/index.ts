import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function() {
    const modules : Record<string, any> = {};
    const dir = path.join(__dirname, `./`);
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
        if (!file.endsWith(`.js`)) continue;
        if (file === `index.js`) continue;

        const filePath = pathToFileURL(path.join(dir, file)).href;
        const imported = await import(filePath);

        modules[file.replace(`.js`, ``)] = imported.default ?? imported;
    }

    return modules;
}