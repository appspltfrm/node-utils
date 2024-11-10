#!/usr/bin/env node

import {watchDuplicate} from "../watchDuplicate.js";

const args = process.argv.slice(2);

const watch: [source: string, target: string][] = [];

for (let index = 0; index < args.length; index++) {
    const source = args[index];
    const target = args[++index];
    if (!target) {
        throw new Error(`Target ${index + 1} missing`);
    }

    watch.push([source, target]);
}

watchDuplicate(...watch);
