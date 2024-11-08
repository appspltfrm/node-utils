import * as fs from "fs";

export function createDirIfNotExists(path) {

    let stat;
    try {
        stat = fs.statSync(path);
    } catch (e) {
    }

    if (stat && !stat.isDirectory()) {
        throw new Error("Cannot create directory - there is a file named like request directory: " + path);

    } else if (stat && stat.isDirectory()) {

    } else {
        fs.mkdirSync(path);
    }
}