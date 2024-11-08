#!/usr/bin/env node

import * as path from "path";
import * as process from "process";
import {copyDirRecursiveSync} from "../copyDirRecursiveSync";
import {dirExists} from "../dirExists";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);

if (dirExists(source)) {
    copyDirRecursiveSync(source, target);
}
