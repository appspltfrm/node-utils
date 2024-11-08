#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process = require("process");
const file_system_1 = require("../../file-system");
if (process.cwd().indexOf("node_modules") > -1) {
    const source = path.join(process.cwd(), "dist");
    const target = process.cwd();
    if ((0, file_system_1.dirExists)(source)) {
        (0, file_system_1.copyDirRecursiveSync)(source, target, { exclude: ["dist/package.json$", "dist/package-lock.json$", "dist/node_modules$"] });
        (0, file_system_1.clearDir)(source);
    }
}
