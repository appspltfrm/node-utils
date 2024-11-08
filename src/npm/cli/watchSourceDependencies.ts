#!/usr/bin/env node

import * as watch from "chokidar";
import {copySync, readJsonSync, removeSync} from "fs-extra";
import * as path from "path";
import {sourceDependencies} from "./sourceDependencies";

const rootDir = path.resolve("./");
const pckg = readJsonSync("package.json");
const dependencies = sourceDependencies();

if (pckg.sourceDependenciesOutDir) {
    console.log(`Started watching source dependencies:`);

    for (const depName of Object.keys(dependencies)) {

        if (dependencies[depName].repoPath) {
            const source = path.resolve(dependencies[depName].repoPath, dependencies[depName].srcDir);
            const moduleOut = path.resolve(rootDir, "node_modules", depName, dependencies[depName].srcDir);
            const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
            const watcher = watch.watch(source, {ignored: ".DS_Store"});

            console.log(`* ${out}`);

            watcher.on("change", (filename, stats) => {
                console.log(`changed file ${filename}`);
                for (const o of [moduleOut, out]) {
                    copySync(filename, path.join(o, filename.substr(source.length)), {preserveTimestamps: true});
                }
            });

            watcher.on("add", (filename, stats) => {
                console.log(`added file ${filename}`);
                for (const o of [moduleOut, out]) {
                    copySync(filename, path.join(o, filename.substr(source.length)), {preserveTimestamps: true});
                }
            });

            watcher.on("unlink", (filename, stats) => {
                console.log(`deleted file ${filename}`);
                for (const o of [moduleOut, out]) {
                    removeSync(path.join(o, filename.substr(source.length)));
                }
            });

            watcher.on("unlinkDir", (filename, stats) => {
                console.log(`deleted dir ${filename}`);
                for (const o of [moduleOut, out]) {
                    removeSync(path.join(o, filename.substr(source.length)));
                }
            });
        }
    }
}


