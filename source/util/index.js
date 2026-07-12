/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name index.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function() {
    const modules = {};
    const files = await fs.promises.readdir(path.join(__dirname, `./`));
    for (const file of files) {
        if (file.endsWith(`.js`)) {
            const name = file.replace(`.js`, ``);
            if(name != `index`) {
                let data = await import(`./${file}`)
                modules[name] = (data.default) ? data.default : data;
            }
        }
    }
    return modules;
}