#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const globDelete_1 = require("../globDelete");
const args = process.argv.slice(2);
(0, globDelete_1.globDelete)(args, {});
