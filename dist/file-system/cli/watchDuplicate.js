#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watchDuplicate_1 = require("../watchDuplicate");
const args = process.argv.slice(2);
const watch = [];
for (let index = 0; index < args.length; index++) {
    const source = args[index];
    const target = args[++index];
    if (!target) {
        throw new Error(`Target ${index + 1} missing`);
    }
    watch.push([source, target]);
}
(0, watchDuplicate_1.watchDuplicate)(...watch);
