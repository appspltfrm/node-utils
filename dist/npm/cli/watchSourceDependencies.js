#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watch = require("chokidar");
const fs_extra_1 = require("fs-extra");
const path = require("path");
const sourceDependencies_1 = require("./sourceDependencies");
const rootDir = path.resolve("./");
const pckg = (0, fs_extra_1.readJsonSync)("package.json");
const dependencies = (0, sourceDependencies_1.sourceDependencies)();
if (pckg.sourceDependenciesOutDir) {
    console.log(`Started watching source dependencies:`);
    for (const depName of Object.keys(dependencies)) {
        if (dependencies[depName].repoPath) {
            const source = path.resolve(dependencies[depName].repoPath, dependencies[depName].srcDir);
            const moduleOut = path.resolve(rootDir, "node_modules", depName, dependencies[depName].srcDir);
            const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
            const watcher = watch.watch(source, { ignored: ".DS_Store" });
            console.log(`* ${out}`);
            watcher.on("change", (filename, stats) => {
                console.log(`changed file ${filename}`);
                for (const o of [moduleOut, out]) {
                    (0, fs_extra_1.copySync)(filename, path.join(o, filename.substr(source.length)), { preserveTimestamps: true });
                }
            });
            watcher.on("add", (filename, stats) => {
                console.log(`added file ${filename}`);
                for (const o of [moduleOut, out]) {
                    (0, fs_extra_1.copySync)(filename, path.join(o, filename.substr(source.length)), { preserveTimestamps: true });
                }
            });
            watcher.on("unlink", (filename, stats) => {
                console.log(`deleted file ${filename}`);
                for (const o of [moduleOut, out]) {
                    (0, fs_extra_1.removeSync)(path.join(o, filename.substr(source.length)));
                }
            });
            watcher.on("unlinkDir", (filename, stats) => {
                console.log(`deleted dir ${filename}`);
                for (const o of [moduleOut, out]) {
                    (0, fs_extra_1.removeSync)(path.join(o, filename.substr(source.length)));
                }
            });
        }
    }
}
