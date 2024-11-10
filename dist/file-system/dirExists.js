import { statSync } from "fs";
export function dirExists(path) {
    let stat;
    try {
        stat = statSync(path);
    }
    catch (e) {
    }
    if (stat && stat.isDirectory()) {
        return true;
    }
    return false;
}
