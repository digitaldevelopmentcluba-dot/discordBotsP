import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { pathToFileURL } from 'url';

/**
 * 
 * @param {*} dir - the path to retrieve the modules from. 
 * @param {*} callback 
 * @returns The 
 */
export async function importMany(
	dir,
	callback
) {
	const modules = [];

	const readDirRecursive = async (currentDir) => {
		const files = readdirSync(currentDir);

		for (const file of files) {
			const filePath = join(currentDir, file);
			const fileStat = statSync(filePath);

			if (fileStat.isDirectory()) {
				await readDirRecursive(filePath);
			} else if (
				(file.endsWith('.js') || file.endsWith('.ts')) &&
				!file.endsWith('.d.ts')
			) {
				const fileUrl = pathToFileURL(filePath).href;
				const module = await import(fileUrl);
				if (callback) {
					callback(module);
				} else {
					modules.push(module);
				}
			}
		}
	};

	await readDirRecursive(dir);
	return modules;
}