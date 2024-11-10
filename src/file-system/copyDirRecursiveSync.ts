import {mkdirSync, existsSync, lstatSync, readdirSync} from "fs";
import * as path from "path";
import {copyFileSync} from "./copyFileSync.js";

export function copyDirRecursiveSync(source: string, target: string, options?: { exclude?: Array<string | RegExp> }) {

    if (!existsSync(target)) {
        mkdirSync(target);
    }

    // copy
    if (lstatSync(source).isDirectory()) {

        readdirSync(source).forEach(function (fileName) {

            let file = path.join(source, fileName);

            if (options && options.exclude) {
                for (let e of options.exclude) {
                    if (file.match(e)) {
                        return;
                    }
                }
            }

            if (lstatSync(file).isDirectory()) {
                copyDirRecursiveSync(file, path.join(target, fileName));
            } else {
                copyFileSync(file, path.join(target, fileName));
            }

        });
    }
}
