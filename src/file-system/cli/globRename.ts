#!/usr/bin/env node

import * as process from "process";
import {globRename} from "../globRename";

const args = process.argv.slice(2);
const find = args[0];
const replace = args[1];
const paths = args.slice(2);

globRename(undefined, paths, find, replace);
