"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dirExists = dirExists;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
function dirExists(path) {
    let stat;
    try {
        stat = fs.statSync(path);
    }
    catch (e) {
    }
    if (stat && stat.isDirectory()) {
        return true;
    }
    return false;
}
