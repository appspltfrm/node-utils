#!/usr/bin/env node

import * as fs from "fs-extra";
import * as path from "path";
import * as process from "process";
import * as child_process from "child_process";

const args = process.argv.slice(2);
const type = path.resolve(args[0]);

if (process.cwd().indexOf("node_modules") < 0) {

    const rootDir = path.resolve("./");
    const pckg = fs.readJsonSync("package.json");
    const dependencies = pckg[`${type}Dependencies`];

    if (Object.keys(dependencies).length) {

        for (const d of Object.keys(dependencies)) {
            child_process.execSync(`npm install ${d} --no-save`, {stdio: "inherit"});
        }
    }
}
