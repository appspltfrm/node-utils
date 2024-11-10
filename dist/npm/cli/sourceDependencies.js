import { readJsonSync } from "fs-extra/esm";
import { existsSync } from "fs";
import path from "path";
const rootDir = path.resolve("./");
const rootPckg = readJsonSync("package.json");
export function sourceDependencies() {
    const deps = {};
    if (rootPckg.sourceDependencies) {
        readPackageDependencies(rootDir, deps);
    }
    return deps;
}
function readPackageDependencies(dir, deps) {
    const jsonPath = path.resolve(dir, "package.json");
    if (!existsSync(jsonPath)) {
        console.warn(`Missing package.json in ${dir} it should be there if you want to use source dependencies.`);
        return deps;
    }
    const pckg = readJsonSync(jsonPath);
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
