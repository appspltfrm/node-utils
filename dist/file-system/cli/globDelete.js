#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const globDelete_1 = require("../globDelete");
const args = process.argv.slice(2);
(0, globDelete_1.globDelete)(args, {});
