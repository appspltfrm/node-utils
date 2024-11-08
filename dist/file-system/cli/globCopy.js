#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process = require("process");
const globCopy_1 = require("../globCopy");
const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);
const segments = args.slice(2);
(0, globCopy_1.globCopy)(source, segments, target);
