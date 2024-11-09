#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const process = tslib_1.__importStar(require("process"));
const file_system_1 = require("../../file-system");
const sourceDependencies_1 = require("./sourceDependencies");
if (process.cwd().indexOf("node_modules") < 0) {
    const rootDir = path.resolve("./");
    const pckg = fs.readJsonSync("package.json");
    const dependencies = (0, sourceDependencies_1.sourceDependencies)();
    if (Object.keys(dependencies).length) {
        if (pckg.sourceDependenciesOutDir) {
            for (const depName of Object.keys(dependencies)) {
                const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
                fs.ensureDirSync(out);
                (0, file_system_1.copyDirRecursiveSync)(dependencies[depName].srcPath, out);
            }
        }
        else {
            throw new Error("package.json must have sourceDependenciesOutDir");
        }
    }
}
