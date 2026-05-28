#!/usr/bin/env node
import { readJsonSync } from "fs-extra/esm";
import { resolve } from "path";
import { argv, cwd } from "process";
import { execSync } from "child_process";
const args = argv.slice(2);
const type = args[0];
if (cwd().indexOf("node_modules") < 0 && type) {
    const rootDir = resolve("./");
    const pckg = readJsonSync("package.json");
    const dependencies = pckg[`${type}Dependencies`];
    if (Object.keys(dependencies).length) {
        for (const [d, v] of Object.entries(dependencies)) {
            const n = type === "optional" ? d : (v.startsWith("file:") || v.startsWith("github:") ? v : d);
            execSync(`npm install ${n} --no-save`, { stdio: "inherit" });
        }
    }
}
