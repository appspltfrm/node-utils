#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process = require("process");
const clearDir_1 = require("../clearDir");
const dirExists_1 = require("../dirExists");
const args = process.argv.slice(2);
const source = path.resolve(args[0]);
if ((0, dirExists_1.dirExists)(source)) {
    (0, clearDir_1.clearDir)(source);
}
