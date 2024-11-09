"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceDependencies = sourceDependencies;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const rootDir = path.resolve("./");
const rootPckg = fs.readJsonSync("package.json");
function sourceDependencies() {
    const deps = {};
    if (rootPckg.sourceDependencies) {
        readPackageDependencies(rootDir, deps);
    }
    return deps;
}
function readPackageDependencies(dir, deps) {
    const jsonPath = path.resolve(dir, "package.json");
    if (!fs.existsSync(jsonPath)) {
        console.warn(`Missing package.json in ${dir} it should be there if you want to use source dependencies.`);
        return deps;
    }
    const pckg = fs.readJsonSync(jsonPath);
    if (deps[pckg.name]) {
        return deps;
    }
    if (pckg.sourceDependencyDir && pckg.name !== rootPckg.name) {
        deps[pckg.name] = { modulePath: path.resolve(dir), srcPath: path.resolve(dir, pckg.sourceDependencyDir), srcDir: pckg.sourceDependencyDir };
    }
    const sourceDeps = Array.isArray(pckg.sourceDependencies) ? Object.assign({}, ...(pckg.sourceDependencies.map(dep => ({ [dep]: {} })))) : pckg.sourceDependencies;
    for (const moduleName in sourceDeps) {
        readPackageDependencies(path.resolve(rootDir, "node_modules", moduleName), deps);
        if (rootDir === dir && sourceDeps[moduleName].repoPath && deps[moduleName]) {
            deps[moduleName].repoPath = path.resolve(sourceDeps[moduleName].repoPath);
        }
    }
    return deps;
}
