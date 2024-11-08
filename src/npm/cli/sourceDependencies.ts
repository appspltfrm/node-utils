import * as fs from "fs-extra";
import * as path from "path";

const rootDir = path.resolve("./");
const rootPckg = fs.readJsonSync("package.json");

interface SourceDependencies {
    [depsName: string]: {modulePath: string, srcPath: string, srcDir: string, repoPath?: string}
}

export function sourceDependencies() {
    const deps: SourceDependencies = {};

    if (rootPckg.sourceDependencies) {
        readPackageDependencies(rootDir, deps);
    }

    return deps;
}

function readPackageDependencies(dir: string, deps: SourceDependencies) {

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
        deps[pckg.name] = {modulePath: path.resolve(dir), srcPath: path.resolve(dir, pckg.sourceDependencyDir), srcDir: pckg.sourceDependencyDir};
    }

    const sourceDeps: {[moduleName: string]: {repoPath?: string}} = Array.isArray(pckg.sourceDependencies) ? Object.assign({}, ...((pckg.sourceDependencies as string[]).map(dep => ({[dep]: {}})))) : pckg.sourceDependencies;

    for (const moduleName in sourceDeps) {
        readPackageDependencies(path.resolve(rootDir, "node_modules", moduleName), deps);

        if (rootDir === dir && sourceDeps[moduleName].repoPath && deps[moduleName]) {
            deps[moduleName].repoPath = path.resolve(sourceDeps[moduleName].repoPath);
        }
    }

    return deps;
}
