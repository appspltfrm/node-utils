"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFileSync = copyFileSync;
const fs = require("fs");
function copyFileSync(source, target) {
    fs.writeFileSync(target, fs.readFileSync(source));
}
