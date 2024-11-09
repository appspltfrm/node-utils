#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const process = tslib_1.__importStar(require("process"));
const child_process = tslib_1.__importStar(require("child_process"));
const args = process.argv.slice(2);
const type = path.resolve(args[0]);
if (process.cwd().indexOf("node_modules") < 0) {
    const rootDir = path.resolve("./");
    const pckg = fs.readJsonSync("package.json");
    const dependencies = pckg[`${type}Dependencies`];
    if (Object.keys(dependencies).length) {
        for (const d of Object.keys(dependencies)) {
            child_process.execSync(`npm install ${d} --no-save`, { stdio: "inherit" });
        }
    }
}