#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const process = tslib_1.__importStar(require("process"));
const copyDirRecursiveSync_1 = require("../copyDirRecursiveSync");
const dirExists_1 = require("../dirExists");
const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);
if ((0, dirExists_1.dirExists)(source)) {
    (0, copyDirRecursiveSync_1.copyDirRecursiveSync)(source, target);
}
