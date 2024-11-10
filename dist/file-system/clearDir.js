import { statSync, unlinkSync, rmdirSync, readdirSync } from "fs";
import * as path from "path";
export function clearDir(dir) {
    let files;
    try {
        files = readdirSync(dir);
    }
    catch (e) {
        return;
    }
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = path.resolve(dir, files[i]);
            if (statSync(file).isFile()) {
                unlinkSync(file);
            }
            else {
                clearDir(file);
                rmdirSync(file);
            }
        }
    }
}
