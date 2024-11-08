import * as fs from "fs";
import * as path from "path";
import {copyFileSync} from "./copyFileSync";

export function copyDirRecursiveSync(source: string, target: string, options?: { exclude?: Array<string | RegExp> }) {

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    // copy
    if (fs.lstatSync(source).isDirectory()) {

        fs.readdirSync(source).forEach(function (fileName) {

            let file = path.join(source, fileName);

            if (options && options.exclude) {
                for (let e of options.exclude) {
                    if (file.match(e)) {
                        return;
                    }
                }
            }

            if (fs.lstatSync(file).isDirectory()) {
                copyDirRecursiveSync(file, path.join(target, fileName));
            } else {
                copyFileSync(file, path.join(target, fileName));
            }

        });
    }
}