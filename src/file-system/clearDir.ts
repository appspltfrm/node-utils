import * as fs from "fs";
import * as path from "path";

export function clearDir(dir: string) {

    let files;

    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return;
    }

    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = path.resolve(dir, files[i]);
            if (fs.statSync(file).isFile()) {
                fs.unlinkSync(file);
            } else {
                clearDir(file);
                fs.rmdirSync(file);
            }
        }
    }
}