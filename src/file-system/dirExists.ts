import {statSync, Stats} from "fs";

export function dirExists(path) {

    let stat: Stats | undefined;
    try {
        stat = statSync(path);
    } catch (e) {
    }

    if (stat && stat.isDirectory()) {
        return true;
    }

    return false;
}
