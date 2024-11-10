#!/usr/bin/env node
import { readJsonSync, ensureDirSync } from "fs-extra/esm";
import path from "path";
import process from "process";
import { copyDirRecursiveSync } from "../../file-system/copyDirRecursiveSync.js";
import { sourceDependencies } from "./sourceDependencies.js";
if (process.cwd().indexOf("node_modules") < 0) {
    const rootDir = path.resolve("./");
    const pckg = readJsonSync("package.json");
    const dependencies = sourceDependencies();
    if (Object.keys(dependencies).length) {
        if (pckg.sourceDependenciesOutDir) {
            for (const depName of Object.keys(dependencies)) {
                const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
                ensureDirSync(out);
                copyDirRecursiveSync(dependencies[depName].srcPath, out);
            }
        }
        else {
            throw new Error("package.json must have sourceDependenciesOutDir");
        }
    }
}
