import * as fs from "fs";
import * as path from "path";

export function createDirs(folderPath: string, mode?: string) {
    const folders = [];
    let tmpPath = path.normalize(folderPath);
    let exists = fs.existsSync(tmpPath);
    while (!exists) {
        folders.push(tmpPath);
        tmpPath = path.join(tmpPath, "..");
        exists = fs.existsSync(tmpPath);
    }

    for (let i = folders.length - 1; i >= 0; i--) {
        fs.mkdirSync(folders[i], mode);
    }
}