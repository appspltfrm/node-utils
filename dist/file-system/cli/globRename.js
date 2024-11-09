#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const globRename_1 = require("../globRename");
const args = process.argv.slice(2);
const find = args[0];
const replace = args[1];
const paths = args.slice(2);
(0, globRename_1.globRename)(undefined, paths, find, replace);
