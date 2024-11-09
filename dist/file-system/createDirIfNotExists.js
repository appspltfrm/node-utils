"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirIfNotExists = createDirIfNotExists;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
function createDirIfNotExists(path) {
    let stat;
    try {
        stat = fs.statSync(path);
    }
    catch (e) {
    }
    if (stat && !stat.isDirectory()) {
        throw new Error("Cannot create directory - there is a file named like request directory: " + path);
    }
    else if (stat && stat.isDirectory()) {
    }
    else {
        fs.mkdirSync(path);
    }
}
