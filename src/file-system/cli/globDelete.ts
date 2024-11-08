#!/usr/bin/env node

import * as process from "process";
import {globDelete} from "../globDelete";

const args = process.argv.slice(2);

globDelete(args, {});
