#!/usr/bin/env node

import path from "path";
import process from "process";
import {copyDirRecursiveSync} from "../copyDirRecursiveSync.js";
import {dirExists} from "../dirExists.js";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);

if (dirExists(source)) {
    copyDirRecursiveSync(source, target);
}
