import * as fs from "fs";

export function dirExists(path) {

    let stat;
    try {
        stat = fs.statSync(path);
    } catch (e) {
    }

    if (stat && stat.isDirectory()) {
        return true;
    }

    return false;
}