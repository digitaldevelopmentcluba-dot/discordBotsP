import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function() {
    const modules: Record<string, any> = {};
    const baseDir = __dirname;
    const folders = await fs.promises.readdir(baseDir);

    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        const stat = await fs.promises.stat(folderPath);

        if (!stat.isDirectory()) continue;
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            if (!file.endsWith(`.js`)) continue;

            const filePath = pathToFileURL(path.join(folderPath, file)).href;
            const imported = await import(filePath);
            const moduleName = `${folder}/${file.replace(`.js`, ``)}`;
            modules[moduleName] = imported.default ?? imported;
        }
    }

    return modules;
}