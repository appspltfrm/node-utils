#!/usr/bin/env node

import path from "path";
import process from "process";
import {globCopy} from "../globCopy.js";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);
const segments = args.slice(2);

globCopy(source, segments, target);
