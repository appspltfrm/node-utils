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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const file_system_1 = require("../../file-system");
const sourceDependencies_1 = require("./sourceDependencies");
if (process.cwd().indexOf("node_modules") < 0) {
    const rootDir = path.resolve("./");
    const pckg = fs.readJsonSync("package.json");
    const dependencies = (0, sourceDependencies_1.sourceDependencies)();
    if (Object.keys(dependencies).length) {
        if (pckg.sourceDependenciesOutDir) {
            for (const depName of Object.keys(dependencies)) {
                const out = path.resolve(rootDir, pckg.sourceDependenciesOutDir, depName);
                fs.ensureDirSync(out);
                (0, file_system_1.copyDirRecursiveSync)(dependencies[depName].srcPath, out);
            }
        }
        else {
            throw new Error("package.json must have sourceDependenciesOutDir");
        }
    }
}
