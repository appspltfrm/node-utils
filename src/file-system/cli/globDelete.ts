#!/usr/bin/env node

import process from "process";
import {globDelete} from "../globDelete.js";

const args = process.argv.slice(2);

globDelete(args, {});
