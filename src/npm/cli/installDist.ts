#!/usr/bin/env node

import path from "path";
import process from "process";
import {clearDir} from "../../file-system/clearDir.js";
import {copyDirRecursiveSync} from "../../file-system/copyDirRecursiveSync.js";
import {dirExists} from "../../file-system/dirExists.js";

if (process.cwd().indexOf("node_modules") > -1) {
    const source = path.join(process.cwd(), "dist");
    const target = process.cwd();

    if (dirExists(source)) {
        copyDirRecursiveSync(source, target, {exclude: ["dist/package.json$", "dist/package-lock.json$", "dist/node_modules$"]});
        clearDir(source);
    }
}
