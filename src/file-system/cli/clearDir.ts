#!/usr/bin/env node

import path from "path";
import process from "process";
import {clearDir} from "../clearDir.js";
import {dirExists} from "../dirExists.js";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);

if (dirExists(source)) {
    clearDir(source);
}
