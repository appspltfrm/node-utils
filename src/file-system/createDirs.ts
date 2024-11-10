import {existsSync, mkdirSync} from "fs";
import path from "path";

export function createDirs(folderPath: string, mode?: string) {
    const folders = [];
    let tmpPath = path.normalize(folderPath);
    let exists = existsSync(tmpPath);
    while (!exists) {
        folders.push(tmpPath);
        tmpPath = path.join(tmpPath, "..");
        exists = existsSync(tmpPath);
    }

    for (let i = folders.length - 1; i >= 0; i--) {
        mkdirSync(folders[i], mode);
    }
}
