#!/usr/bin/env node

import * as fs from "fs-extra";
import * as path from "path";
import * as process from "process";
import {copyDirRecursiveSync} from "../../file-system";
import {sourceDependencies} from "./sourceDependencies";

if (process.cwd().indexOf("node_modules") < 0) {

    const rootDir = path.resolve("./");
    const pckg = fs.readJsonSync("package.json");
    const dependencies = sourceDependencies();

    if (Object.keys(dependencies).length) {

        if (pckg.sourceDependenciesOutDir) {

            for (const depName of Object.keys(dependencies)) {
                const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
                fs.ensureDirSync(out);
                copyDirRecursiveSync(dependencies[depName].srcPath, out);
            }

        } else {
            throw new Error("package.json must have sourceDependenciesOutDir");
        }
    }
}