"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFileSync = copyFileSync;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
function copyFileSync(source, target) {
    fs.writeFileSync(target, fs.readFileSync(source));
}
