#!/usr/bin/env node

import * as path from "path";
import * as process from "process";
import {clearDir} from "../clearDir";
import {dirExists} from "../dirExists";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);

if (dirExists(source)) {
    clearDir(source);
}
