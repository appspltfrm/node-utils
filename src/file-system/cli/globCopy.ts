#!/usr/bin/env node

import * as path from "path";
import * as process from "process";
import {globCopy} from "../globCopy";

const args = process.argv.slice(2);
const source = path.resolve(args[0]);
const target = path.resolve(args[1]);
const segments = args.slice(2);

globCopy(source, segments, target);
