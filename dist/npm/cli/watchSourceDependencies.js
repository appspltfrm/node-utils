#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const watch = __importStar(require("chokidar"));
const fs_extra_1 = require("fs-extra");
const path = __importStar(require("path"));
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
